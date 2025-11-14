export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password_hash: string;
          birth_date: string;
          subscription_status: 'pending' | 'active' | 'cancelled' | 'expired';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password_hash: string;
          birth_date: string;
          subscription_status?: 'pending' | 'active' | 'cancelled' | 'expired';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password_hash?: string;
          birth_date?: string;
          subscription_status?: 'pending' | 'active' | 'cancelled' | 'expired';
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          transaction_date: string;
          status: 'pending' | 'paid' | 'refunded' | 'cancelled';
          amount: number;
          kiwify_transaction_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          transaction_date?: string;
          status?: 'pending' | 'paid' | 'refunded' | 'cancelled';
          amount: number;
          kiwify_transaction_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          transaction_date?: string;
          status?: 'pending' | 'paid' | 'refunded' | 'cancelled';
          amount?: number;
          kiwify_transaction_id?: string | null;
        };
      };
    };
  };
};

export type User = Database['public']['Tables']['users']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
