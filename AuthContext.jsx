import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  // useNavigate hook cannot be called at the top level of a module.
  // It must be called within a component or a custom hook.
  // We will call it inside useEffect or login/signup functions where navigation occurs.

  const fetchUserProfile = async (userId) => {
    if (!userId) return null;
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, role, avatar_url`)
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };
  
  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);

      if (currentUser) {
        const userProfile = await fetchUserProfile(currentUser.id);
        setProfile(userProfile);
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setLoading(true);
        setSession(newSession);
        const currentUser = newSession?.user ?? null;
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
        if (currentUser) {
          const userProfile = await fetchUserProfile(currentUser.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
  
  const login = async (credentials) => {
    setLoading(true);
    const { error, data: loginData } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      setLoading(false);
      throw error;
    }
    if (loginData.user) {
      const userProfile = await fetchUserProfile(loginData.user.id);
      setProfile(userProfile);
      setUser(loginData.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
    return { user: loginData.user, profile: profile };
  };

  const signup = async (credentials) => {
    setLoading(true);
    const { name, email, password, role = 'prospecteur' } = credentials; // Default role
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role, 
        },
      },
    });
    // The trigger handle_new_user will create the profile.
    // We might want to fetch it immediately after signup if needed for redirection.
    setLoading(false);
    if (error) throw error;
    // User will be set by onAuthStateChange, profile will be fetched there too.
    return data;
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    setSession(null);
  };
  
  const updateUserProfileAndMetadata = async (userId, profileData, metadata) => {
    setLoading(true);
    let profileUpdateError = null;
    let metadataUpdateError = null;
    let updatedProfileData = null;

    // Update public.profiles table
    const { data: profileUpdateResult, error: profileErr } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (profileErr) {
      console.error("Error updating profile:", profileErr);
      profileUpdateError = profileErr;
    } else {
      updatedProfileData = profileUpdateResult;
      setProfile(updatedProfileData); // Update local profile state
    }

    // Update auth.users user_metadata
    if (metadata) {
      const { data: userUpdateResult, error: metadataErr } = await supabase.auth.updateUser({ data: metadata });
      if (metadataErr) {
        console.error("Error updating user metadata:", metadataErr);
        metadataUpdateError = metadataErr;
      }
      if (userUpdateResult?.user) {
         // Merge existing user data with new metadata to avoid overwriting other fields
        setUser(prevUser => ({ ...prevUser, ...userUpdateResult.user }));
      }
    }
    
    setLoading(false);
    if (profileUpdateError || metadataUpdateError) {
      throw profileUpdateError || metadataUpdateError;
    }
    return { profile: updatedProfileData, user: user };
  };


  const value = {
    user,
    profile,
    isAuthenticated,
    loading,
    session,
    login,
    signup,
    logout,
    setUser, 
    setIsAuthenticated,
    updateUserProfileAndMetadata,
    fetchUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};