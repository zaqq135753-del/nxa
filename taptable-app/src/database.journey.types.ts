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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      cd_bookings: {
        Row: {
          business_id: string
          checked_in_at: string | null
          ends_at: string
          id: string
          offering_id: string
          order_id: string
          seats: number
          starts_at: string
        }
        Insert: {
          business_id: string
          checked_in_at?: string | null
          ends_at: string
          id?: string
          offering_id: string
          order_id: string
          seats: number
          starts_at: string
        }
        Update: {
          business_id?: string
          checked_in_at?: string | null
          ends_at?: string
          id?: string
          offering_id?: string
          order_id?: string
          seats?: number
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cd_bookings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "cd_businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cd_bookings_offering_id_business_id_fkey"
            columns: ["offering_id", "business_id"]
            isOneToOne: false
            referencedRelation: "cd_offerings"
            referencedColumns: ["id", "business_id"]
          },
          {
            foreignKeyName: "cd_bookings_order_id_business_id_fkey"
            columns: ["order_id", "business_id"]
            isOneToOne: false
            referencedRelation: "cd_orders"
            referencedColumns: ["id", "business_id"]
          },
        ]
      }
      cd_businesses: {
        Row: {
          accepting_orders: boolean
          created_at: string
          delivery_fee_cents: number
          id: string
          is_demo: boolean
          name: string
          niche: string
          profile: Json
          published: boolean
        }
        Insert: {
          accepting_orders?: boolean
          created_at?: string
          delivery_fee_cents?: number
          id: string
          is_demo?: boolean
          name: string
          niche: string
          profile?: Json
          published?: boolean
        }
        Update: {
          accepting_orders?: boolean
          created_at?: string
          delivery_fee_cents?: number
          id?: string
          is_demo?: boolean
          name?: string
          niche?: string
          profile?: Json
          published?: boolean
        }
        Relationships: []
      }
      cd_members: {
        Row: {
          business_id: string
          role: string
          user_id: string
        }
        Insert: {
          business_id: string
          role: string
          user_id: string
        }
        Update: {
          business_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cd_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "cd_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      cd_offerings: {
        Row: {
          available: boolean
          business_id: string
          capacity: number
          details: Json
          duration_min: number
          id: string
          kind: string
          name: string
          price_cents: number
          stock: number | null
        }
        Insert: {
          available?: boolean
          business_id: string
          capacity?: number
          details?: Json
          duration_min?: number
          id: string
          kind: string
          name: string
          price_cents: number
          stock?: number | null
        }
        Update: {
          available?: boolean
          business_id?: string
          capacity?: number
          details?: Json
          duration_min?: number
          id?: string
          kind?: string
          name?: string
          price_cents?: number
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cd_offerings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "cd_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      cd_order_lines: {
        Row: {
          name: string
          offering_id: string
          order_id: string
          quantity: number
          unit_price_cents: number
        }
        Insert: {
          name: string
          offering_id: string
          order_id: string
          quantity: number
          unit_price_cents: number
        }
        Update: {
          name?: string
          offering_id?: string
          order_id?: string
          quantity?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "cd_order_lines_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "cd_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cd_order_lines_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "cd_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      cd_orders: {
        Row: {
          business_id: string
          created_at: string
          customer_id: string
          customer_name: string
          delivery_fee_cents: number
          destination: Json
          id: string
          payment_status: string
          request_id: string
          status: string
          total_cents: number
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id: string
          customer_name: string
          delivery_fee_cents?: number
          destination?: Json
          id?: string
          payment_status?: string
          request_id: string
          status?: string
          total_cents: number
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: string
          customer_name?: string
          delivery_fee_cents?: number
          destination?: Json
          id?: string
          payment_status?: string
          request_id?: string
          status?: string
          total_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "cd_orders_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "cd_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      cd_service_requests: {
        Row: {
          business_id: string
          created_at: string
          customer_id: string
          detail: string
          id: string
          kind: string
          request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id?: string
          detail: string
          id?: string
          kind: string
          request_id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: string
          detail?: string
          id?: string
          kind?: string
          request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cd_service_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "cd_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      cd_trip_invites: {
        Row: {
          expires_at: string
          token: string
          trip_id: string
        }
        Insert: {
          expires_at?: string
          token?: string
          trip_id: string
        }
        Update: {
          expires_at?: string
          token?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cd_trip_invites_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "cd_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      cd_trip_items: {
        Row: {
          added_by: string
          business_id: string
          id: string
          note: string
          planned_at: string | null
          trip_id: string
        }
        Insert: {
          added_by?: string
          business_id: string
          id?: string
          note?: string
          planned_at?: string | null
          trip_id: string
        }
        Update: {
          added_by?: string
          business_id?: string
          id?: string
          note?: string
          planned_at?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cd_trip_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "cd_businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cd_trip_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "cd_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      cd_trip_members: {
        Row: {
          trip_id: string
          user_id: string
        }
        Insert: {
          trip_id: string
          user_id: string
        }
        Update: {
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cd_trip_members_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "cd_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      cd_trip_votes: {
        Row: {
          item_id: string
          user_id: string
        }
        Insert: {
          item_id: string
          user_id?: string
        }
        Update: {
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cd_trip_votes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "cd_trip_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cd_trips: {
        Row: {
          created_at: string
          id: string
          owner_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cd_cancel_order: { Args: { p_order: string }; Returns: undefined }
      cd_check_in: { Args: { p_booking: string }; Returns: undefined }
      cd_checkout: {
        Args: {
          p_business: string
          p_destination: Json
          p_ends?: string
          p_lines: Json
          p_name: string
          p_request: string
          p_starts?: string
        }
        Returns: string
      }
      cd_join_trip: { Args: { p_token: string }; Returns: string }
      cd_set_order_status: {
        Args: { p_order: string; p_status: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

