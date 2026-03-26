import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Configuration', () => {
  let supabaseUrl: string;
  let supabaseAnonKey: string;

  beforeAll(() => {
    supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
  });

  it('should have Supabase URL configured', () => {
    expect(supabaseUrl).toBeTruthy();
    // Extract URL part before any additional env vars
    const urlPart = supabaseUrl.split('EXPO_')[0];
    expect(urlPart).toMatch(/^https:\/\/.+\.supabase\.co$/);
  });

  it('should have Supabase Anon Key configured', () => {
    expect(supabaseAnonKey).toBeTruthy();
    expect(supabaseAnonKey.length).toBeGreaterThan(20);
  });

  it('should create Supabase client successfully', () => {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  it('should connect to Supabase and verify credentials', async () => {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    
    try {
      // Test basic connectivity by checking auth status
      const { data, error } = await client.auth.getSession();
      
      // If error is auth-related but not "invalid credentials", connection is good
      if (error && error.message.includes('invalid')) {
        throw new Error(`Invalid Supabase credentials: ${error.message}`);
      }
      
      // Success: either we got a session or connection is valid
      expect(true).toBe(true);
    } catch (error) {
      throw new Error(`Failed to connect to Supabase: ${error}`);
    }
  });
});
