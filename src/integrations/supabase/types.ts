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
      constraints: {
        Row: {
          created_at: string
          description: string
          id: string
          location: string | null
          owner: string | null
          project_id: string
          resolved_at: string | null
          status: string
          task_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          location?: string | null
          owner?: string | null
          project_id: string
          resolved_at?: string | null
          status?: string
          task_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          location?: string | null
          owner?: string | null
          project_id?: string
          resolved_at?: string | null
          status?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "constraints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "constraints_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_logs: {
        Row: {
          actual_value: number
          created_at: string
          id: string
          logged_date: string
          planned_value: number
          project_id: string
          task_id: string
          wwp_id: string | null
        }
        Insert: {
          actual_value: number
          created_at?: string
          id?: string
          logged_date?: string
          planned_value: number
          project_id: string
          task_id: string
          wwp_id?: string | null
        }
        Update: {
          actual_value?: number
          created_at?: string
          id?: string
          logged_date?: string
          planned_value?: number
          project_id?: string
          task_id?: string
          wwp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_logs_wwp_id_fkey"
            columns: ["wwp_id"]
            isOneToOne: false
            referencedRelation: "weekly_work_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_progress: number | null
          constraint_free: boolean | null
          created_at: string
          has_constraint: boolean | null
          id: string
          location: string | null
          owner: string | null
          planned_progress: number | null
          project_id: string
          status: string
          title: string
          updated_at: string
          wwp_id: string | null
        }
        Insert: {
          actual_progress?: number | null
          constraint_free?: boolean | null
          created_at?: string
          has_constraint?: boolean | null
          id?: string
          location?: string | null
          owner?: string | null
          planned_progress?: number | null
          project_id: string
          status?: string
          title: string
          updated_at?: string
          wwp_id?: string | null
        }
        Update: {
          actual_progress?: number | null
          constraint_free?: boolean | null
          created_at?: string
          has_constraint?: boolean | null
          id?: string
          location?: string | null
          owner?: string | null
          planned_progress?: number | null
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
          wwp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_wwp_id_fkey"
            columns: ["wwp_id"]
            isOneToOne: false
            referencedRelation: "weekly_work_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      variances: {
        Row: {
          id: string
          impact: string | null
          logged_at: string
          project_id: string
          reason: string
          task_id: string
          wwp_id: string | null
        }
        Insert: {
          id?: string
          impact?: string | null
          logged_at?: string
          project_id: string
          reason: string
          task_id: string
          wwp_id?: string | null
        }
        Update: {
          id?: string
          impact?: string | null
          logged_at?: string
          project_id?: string
          reason?: string
          task_id?: string
          wwp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "variances_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variances_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variances_wwp_id_fkey"
            columns: ["wwp_id"]
            isOneToOne: false
            referencedRelation: "weekly_work_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_work_plans: {
        Row: {
          completed_tasks: number
          created_at: string
          id: string
          percent_complete: number
          project_id: string
          total_tasks: number
          updated_at: string
          week_end: string
          week_start: string
        }
        Insert: {
          completed_tasks?: number
          created_at?: string
          id?: string
          percent_complete?: number
          project_id: string
          total_tasks?: number
          updated_at?: string
          week_end: string
          week_start: string
        }
        Update: {
          completed_tasks?: number
          created_at?: string
          id?: string
          percent_complete?: number
          project_id?: string
          total_tasks?: number
          updated_at?: string
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_work_plans_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
