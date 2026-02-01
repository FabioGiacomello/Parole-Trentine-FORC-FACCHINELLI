export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      dictionary_entries: {
        Row: {
          audio_url: string | null
          category: Database["public"]["Enums"]["grammar_category"]
          conjugations: Json | null
          created_at: string
          definition: string | null
          dialect_word: string
          examples: string[] | null
          feminine: string | null
          id: string
          image_url: string | null
          italian_word: string
          notes: string | null
          plural: string | null
          pronunciation: string | null
          related_words: string[] | null
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          category: Database["public"]["Enums"]["grammar_category"]
          conjugations?: Json | null
          created_at?: string
          definition?: string | null
          dialect_word: string
          examples?: string[] | null
          feminine?: string | null
          id?: string
          image_url?: string | null
          italian_word: string
          notes?: string | null
          plural?: string | null
          pronunciation?: string | null
          related_words?: string[] | null
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          category?: Database["public"]["Enums"]["grammar_category"]
          conjugations?: Json | null
          created_at?: string
          definition?: string | null
          dialect_word?: string
          examples?: string[] | null
          feminine?: string | null
          id?: string
          image_url?: string | null
          italian_word?: string
          notes?: string | null
          plural?: string | null
          pronunciation?: string | null
          related_words?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          admin_notes: string | null
          category: Database["public"]["Enums"]["grammar_category"] | null
          created_at: string
          definition: string | null
          dialect_word: string
          examples: string[] | null
          id: string
          italian_word: string
          pronunciation: string | null
          reviewed_at: string | null
          status: string
          submitter_email: string | null
          submitter_name: string | null
        }
        Insert: {
          admin_notes?: string | null
          category?: Database["public"]["Enums"]["grammar_category"] | null
          created_at?: string
          definition?: string | null
          dialect_word: string
          examples?: string[] | null
          id?: string
          italian_word: string
          pronunciation?: string | null
          reviewed_at?: string | null
          status?: string
          submitter_email?: string | null
          submitter_name?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: Database["public"]["Enums"]["grammar_category"] | null
          created_at?: string
          definition?: string | null
          dialect_word?: string
          examples?: string[] | null
          id?: string
          italian_word?: string
          pronunciation?: string | null
          reviewed_at?: string | null
          status?: string
          submitter_email?: string | null
          submitter_name?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator"
      grammar_category:
        | "sostantivo"
        | "verbo"
        | "aggettivo"
        | "avverbio"
        | "preposizione"
        | "congiunzione"
        | "esclamazione"
        | "pronome"
        | "locuzione"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator"],
      grammar_category: [
        "sostantivo",
        "verbo",
        "aggettivo",
        "avverbio",
        "preposizione",
        "congiunzione",
        "esclamazione",
        "pronome",
        "locuzione",
      ],
    },
  },
} as const
