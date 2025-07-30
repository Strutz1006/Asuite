export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          organization_id: string | null
          product: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          organization_id?: string | null
          product: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          organization_id?: string | null
          product?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      align_company_setup: {
        Row: {
          created_at: string
          goal_framework: string | null
          id: string
          organization_id: string | null
          planning_cycle: string | null
          review_frequency: string | null
          setup_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          goal_framework?: string | null
          id?: string
          organization_id?: string | null
          planning_cycle?: string | null
          review_frequency?: string | null
          setup_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          goal_framework?: string | null
          id?: string
          organization_id?: string | null
          planning_cycle?: string | null
          review_frequency?: string | null
          setup_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "align_company_setup_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      align_key_results: {
        Row: {
          completion_date: string | null
          created_at: string | null
          current_value: string | null
          description: string | null
          due_date: string | null
          id: string
          objective_id: string | null
          progress_percentage: number | null
          status: string | null
          target_value: string | null
          title: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          current_value?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          objective_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          target_value?: string | null
          title: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          current_value?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          objective_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          target_value?: string | null
          title?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "align_key_results_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "align_objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      align_objectives: {
        Row: {
          category: string | null
          completion_date: string | null
          confidence_score: number | null
          created_at: string | null
          current_value: string | null
          department_id: string | null
          description: string | null
          due_date: string | null
          framework: string | null
          id: string
          impact_weight: number | null
          level: string
          metadata: Json | null
          organization_id: string | null
          owner_id: string | null
          parent_id: string | null
          priority: string | null
          progress_percentage: number | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          target_value: string | null
          team_id: string | null
          title: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          completion_date?: string | null
          confidence_score?: number | null
          created_at?: string | null
          current_value?: string | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          framework?: string | null
          id?: string
          impact_weight?: number | null
          level: string
          metadata?: Json | null
          organization_id?: string | null
          owner_id?: string | null
          parent_id?: string | null
          priority?: string | null
          progress_percentage?: number | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          target_value?: string | null
          team_id?: string | null
          title: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          completion_date?: string | null
          confidence_score?: number | null
          created_at?: string | null
          current_value?: string | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          framework?: string | null
          id?: string
          impact_weight?: number | null
          level?: string
          metadata?: Json | null
          organization_id?: string | null
          owner_id?: string | null
          parent_id?: string | null
          priority?: string | null
          progress_percentage?: number | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          target_value?: string | null
          team_id?: string | null
          title?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "align_objectives_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "align_objectives_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "align_objectives_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "align_objectives_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "align_objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "align_objectives_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      align_progress_updates: {
        Row: {
          achievements: string | null
          blockers: string | null
          comment: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          next_steps: string | null
          objective_id: string | null
          progress_percentage: number | null
          user_id: string | null
          value: string | null
        }
        Insert: {
          achievements?: string | null
          blockers?: string | null
          comment?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          next_steps?: string | null
          objective_id?: string | null
          progress_percentage?: number | null
          user_id?: string | null
          value?: string | null
        }
        Update: {
          achievements?: string | null
          blockers?: string | null
          comment?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          next_steps?: string | null
          objective_id?: string | null
          progress_percentage?: number | null
          user_id?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "align_progress_updates_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "align_objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "align_progress_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      catalyst_activities: {
        Row: {
          assigned_to: string | null
          completion_date: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          journey_id: string | null
          participants: string[] | null
          results: string | null
          status: string | null
          success_criteria: string | null
          title: string
          type: string | null
        }
        Insert: {
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          journey_id?: string | null
          participants?: string[] | null
          results?: string | null
          status?: string | null
          success_criteria?: string | null
          title: string
          type?: string | null
        }
        Update: {
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          journey_id?: string | null
          participants?: string[] | null
          results?: string | null
          status?: string | null
          success_criteria?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalyst_activities_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalyst_activities_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "catalyst_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      catalyst_journey_phases: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          duration_weeks: number | null
          end_date: string | null
          id: string
          journey_id: string | null
          name: string
          order_index: number
          start_date: string | null
          status: string | null
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          duration_weeks?: number | null
          end_date?: string | null
          id?: string
          journey_id?: string | null
          name: string
          order_index: number
          start_date?: string | null
          status?: string | null
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          duration_weeks?: number | null
          end_date?: string | null
          id?: string
          journey_id?: string | null
          name?: string
          order_index?: number
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalyst_journey_phases_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "catalyst_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      catalyst_journeys: {
        Row: {
          actual_completion_date: string | null
          adoption_percentage: number | null
          budget_allocated: number | null
          budget_spent: number | null
          champion_count: number | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          organization_id: string | null
          owner_id: string | null
          phase: string | null
          readiness_score: number | null
          resistance_level: string | null
          risk_count: number | null
          stakeholder_count: number | null
          start_date: string | null
          status: string | null
          success_criteria: string | null
          tags: string[] | null
          target_completion_date: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          actual_completion_date?: string | null
          adoption_percentage?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          champion_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          phase?: string | null
          readiness_score?: number | null
          resistance_level?: string | null
          risk_count?: number | null
          stakeholder_count?: number | null
          start_date?: string | null
          status?: string | null
          success_criteria?: string | null
          tags?: string[] | null
          target_completion_date?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_completion_date?: string | null
          adoption_percentage?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          champion_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          phase?: string | null
          readiness_score?: number | null
          resistance_level?: string | null
          risk_count?: number | null
          stakeholder_count?: number | null
          start_date?: string | null
          status?: string | null
          success_criteria?: string | null
          tags?: string[] | null
          target_completion_date?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalyst_journeys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalyst_journeys_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      catalyst_stakeholder_engagement: {
        Row: {
          created_at: string | null
          created_by: string | null
          engagement_date: string
          engagement_type: string
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          notes: string | null
          outcome: string | null
          stakeholder_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          engagement_date: string
          engagement_type: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          notes?: string | null
          outcome?: string | null
          stakeholder_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          engagement_date?: string
          engagement_type?: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          notes?: string | null
          outcome?: string | null
          stakeholder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalyst_stakeholder_engagement_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalyst_stakeholder_engagement_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "catalyst_stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      catalyst_stakeholders: {
        Row: {
          communication_preference: string | null
          created_at: string | null
          engagement_level: string | null
          feedback_score: number | null
          id: string
          influence_level: string | null
          journey_id: string | null
          last_interaction: string | null
          notes: string | null
          training_completed: boolean | null
          user_id: string | null
        }
        Insert: {
          communication_preference?: string | null
          created_at?: string | null
          engagement_level?: string | null
          feedback_score?: number | null
          id?: string
          influence_level?: string | null
          journey_id?: string | null
          last_interaction?: string | null
          notes?: string | null
          training_completed?: boolean | null
          user_id?: string | null
        }
        Update: {
          communication_preference?: string | null
          created_at?: string | null
          engagement_level?: string | null
          feedback_score?: number | null
          id?: string
          influence_level?: string | null
          journey_id?: string | null
          last_interaction?: string | null
          notes?: string | null
          training_completed?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalyst_stakeholders_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "catalyst_journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalyst_stakeholders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      catalyst_survey_responses: {
        Row: {
          completed_at: string | null
          id: string
          responses: Json
          sentiment_score: number | null
          survey_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          responses: Json
          sentiment_score?: number | null
          survey_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          responses?: Json
          sentiment_score?: number | null
          survey_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalyst_survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "catalyst_surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalyst_survey_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      catalyst_surveys: {
        Row: {
          closes_at: string | null
          created_at: string | null
          id: string
          journey_id: string | null
          questions: Json
          response_count: number | null
          sent_at: string | null
          target_audience: string[] | null
          title: string
          type: string | null
        }
        Insert: {
          closes_at?: string | null
          created_at?: string | null
          id?: string
          journey_id?: string | null
          questions: Json
          response_count?: number | null
          sent_at?: string | null
          target_audience?: string[] | null
          title: string
          type?: string | null
        }
        Update: {
          closes_at?: string | null
          created_at?: string | null
          id?: string
          journey_id?: string | null
          questions?: Json
          response_count?: number | null
          sent_at?: string | null
          target_audience?: string[] | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalyst_surveys_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "catalyst_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_interactions: {
        Row: {
          app: string
          context_entity_id: string | null
          context_entity_type: string | null
          created_at: string | null
          helpful_rating: number | null
          id: string
          interaction_type: string | null
          organization_id: string | null
          query: string | null
          response: string | null
          sentiment: string | null
          user_id: string | null
        }
        Insert: {
          app: string
          context_entity_id?: string | null
          context_entity_type?: string | null
          created_at?: string | null
          helpful_rating?: number | null
          id?: string
          interaction_type?: string | null
          organization_id?: string | null
          query?: string | null
          response?: string | null
          sentiment?: string | null
          user_id?: string | null
        }
        Update: {
          app?: string
          context_entity_id?: string | null
          context_entity_type?: string | null
          created_at?: string | null
          helpful_rating?: number | null
          id?: string
          interaction_type?: string | null
          organization_id?: string | null
          query?: string | null
          response?: string | null
          sentiment?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_interactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_app_links: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          link_type: string | null
          notes: string | null
          organization_id: string | null
          source_app: string
          source_entity_id: string
          source_entity_type: string
          strength: number | null
          target_app: string
          target_entity_id: string
          target_entity_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          link_type?: string | null
          notes?: string | null
          organization_id?: string | null
          source_app: string
          source_entity_id: string
          source_entity_type: string
          strength?: number | null
          target_app: string
          target_entity_id: string
          target_entity_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          link_type?: string | null
          notes?: string | null
          organization_id?: string | null
          source_app?: string
          source_entity_id?: string
          source_entity_type?: string
          strength?: number | null
          target_app?: string
          target_entity_id?: string
          target_entity_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "cross_app_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_app_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          head_of_department_id: string | null
          id: string
          name: string
          organization_id: string
          parent_department_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          head_of_department_id?: string | null
          id?: string
          name: string
          organization_id: string
          parent_department_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          head_of_department_id?: string | null
          id?: string
          name?: string
          organization_id?: string
          parent_department_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_head_of_department_id_fkey"
            columns: ["head_of_department_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_attachments: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size_bytes: number | null
          file_type: string | null
          file_url: string
          id: string
          organization_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size_bytes?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          organization_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          organization_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_attachments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_comments: {
        Row: {
          content: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          organization_id: string | null
          parent_comment_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          organization_id?: string | null
          parent_comment_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          organization_id?: string | null
          parent_comment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "drive_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_projects: {
        Row: {
          align_goal_id: string | null
          budget_allocated: number | null
          budget_spent: number | null
          completion_date: string | null
          created_at: string | null
          department_id: string | null
          description: string | null
          due_date: string | null
          health: string | null
          id: string
          metadata: Json | null
          name: string
          organization_id: string | null
          owner_id: string | null
          priority: string | null
          progress_percentage: number | null
          risk_level: string | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          align_goal_id?: string | null
          budget_allocated?: number | null
          budget_spent?: number | null
          completion_date?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          health?: string | null
          id?: string
          metadata?: Json | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          priority?: string | null
          progress_percentage?: number | null
          risk_level?: string | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          align_goal_id?: string | null
          budget_allocated?: number | null
          budget_spent?: number | null
          completion_date?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          health?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          priority?: string | null
          progress_percentage?: number | null
          risk_level?: string | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_projects_align_goal_id_fkey"
            columns: ["align_goal_id"]
            isOneToOne: false
            referencedRelation: "align_objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_projects_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_projects_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_tasks: {
        Row: {
          actual_hours: number | null
          align_goal_id: string | null
          assignee_id: string | null
          completion_date: string | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          metadata: Json | null
          organization_id: string | null
          priority: string | null
          progress_percentage: number | null
          project_id: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          align_goal_id?: string | null
          assignee_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          progress_percentage?: number | null
          project_id?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          align_goal_id?: string | null
          assignee_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          progress_percentage?: number | null
          project_id?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_tasks_align_goal_id_fkey"
            columns: ["align_goal_id"]
            isOneToOne: false
            referencedRelation: "align_objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "drive_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_time_entries: {
        Row: {
          billable: boolean | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          organization_id: string | null
          start_time: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          billable?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          organization_id?: string | null
          start_time: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          billable?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          organization_id?: string | null
          start_time?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "drive_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_time_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_analysis_results: {
        Row: {
          analysis_date: string | null
          analysis_type: string
          completeness_percentage: number | null
          compliance_score: number | null
          consistency_rating: number | null
          document_id: string | null
          efficiency_score: number | null
          id: string
          issues_found: number | null
          metadata: Json | null
          quality_score: number | null
          readability_score: number | null
          suggestions_count: number | null
        }
        Insert: {
          analysis_date?: string | null
          analysis_type: string
          completeness_percentage?: number | null
          compliance_score?: number | null
          consistency_rating?: number | null
          document_id?: string | null
          efficiency_score?: number | null
          id?: string
          issues_found?: number | null
          metadata?: Json | null
          quality_score?: number | null
          readability_score?: number | null
          suggestions_count?: number | null
        }
        Update: {
          analysis_date?: string | null
          analysis_type?: string
          completeness_percentage?: number | null
          compliance_score?: number | null
          consistency_rating?: number | null
          document_id?: string | null
          efficiency_score?: number | null
          id?: string
          issues_found?: number | null
          metadata?: Json | null
          quality_score?: number | null
          readability_score?: number | null
          suggestions_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_analysis_results_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "flow_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_compliance_checks: {
        Row: {
          checked_at: string | null
          compliance_status: string | null
          document_id: string | null
          framework_id: string | null
          gap_description: string | null
          id: string
          priority: string | null
          recommendation: string | null
          requirement_id: string | null
          requirement_name: string | null
        }
        Insert: {
          checked_at?: string | null
          compliance_status?: string | null
          document_id?: string | null
          framework_id?: string | null
          gap_description?: string | null
          id?: string
          priority?: string | null
          recommendation?: string | null
          requirement_id?: string | null
          requirement_name?: string | null
        }
        Update: {
          checked_at?: string | null
          compliance_status?: string | null
          document_id?: string | null
          framework_id?: string | null
          gap_description?: string | null
          id?: string
          priority?: string | null
          recommendation?: string | null
          requirement_id?: string | null
          requirement_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_compliance_checks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "flow_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_compliance_checks_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "flow_compliance_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_compliance_frameworks: {
        Row: {
          coverage_percentage: number | null
          created_at: string | null
          description: string | null
          id: string
          missing_requirements: number | null
          name: string
          organization_id: string | null
          status: string | null
          version: string | null
        }
        Insert: {
          coverage_percentage?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          missing_requirements?: number | null
          name: string
          organization_id?: string | null
          status?: string | null
          version?: string | null
        }
        Update: {
          coverage_percentage?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          missing_requirements?: number | null
          name?: string
          organization_id?: string | null
          status?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_compliance_frameworks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_documents: {
        Row: {
          category: string | null
          compliance_status: string | null
          created_at: string | null
          department: string | null
          description: string | null
          file_size_bytes: number | null
          file_type: string | null
          file_url: string | null
          id: string
          last_reviewed_at: string | null
          last_reviewed_by: string | null
          metadata: Json | null
          name: string
          next_review_date: string | null
          organization_id: string | null
          owner_id: string | null
          quality_score: number | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          version: string | null
          word_count: number | null
        }
        Insert: {
          category?: string | null
          compliance_status?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          last_reviewed_at?: string | null
          last_reviewed_by?: string | null
          metadata?: Json | null
          name: string
          next_review_date?: string | null
          organization_id?: string | null
          owner_id?: string | null
          quality_score?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          version?: string | null
          word_count?: number | null
        }
        Update: {
          category?: string | null
          compliance_status?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          last_reviewed_at?: string | null
          last_reviewed_by?: string | null
          metadata?: Json | null
          name?: string
          next_review_date?: string | null
          organization_id?: string | null
          owner_id?: string | null
          quality_score?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          version?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_documents_last_reviewed_by_fkey"
            columns: ["last_reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_issues: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          document_id: string | null
          id: string
          location_reference: string | null
          recommendation: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          document_id?: string | null
          id?: string
          location_reference?: string | null
          recommendation?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          document_id?: string | null
          id?: string
          location_reference?: string | null
          recommendation?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_issues_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_issues_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "flow_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_process_connections: {
        Row: {
          condition: string | null
          created_at: string | null
          from_node_id: string | null
          id: string
          label: string | null
          process_map_id: string | null
          probability: number | null
          to_node_id: string | null
        }
        Insert: {
          condition?: string | null
          created_at?: string | null
          from_node_id?: string | null
          id?: string
          label?: string | null
          process_map_id?: string | null
          probability?: number | null
          to_node_id?: string | null
        }
        Update: {
          condition?: string | null
          created_at?: string | null
          from_node_id?: string | null
          id?: string
          label?: string | null
          process_map_id?: string | null
          probability?: number | null
          to_node_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_process_connections_from_node_id_fkey"
            columns: ["from_node_id"]
            isOneToOne: false
            referencedRelation: "flow_process_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_process_connections_process_map_id_fkey"
            columns: ["process_map_id"]
            isOneToOne: false
            referencedRelation: "flow_process_maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_process_connections_to_node_id_fkey"
            columns: ["to_node_id"]
            isOneToOne: false
            referencedRelation: "flow_process_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_process_maps: {
        Row: {
          complexity: string | null
          created_at: string | null
          department_id: string | null
          description: string | null
          estimated_duration: string | null
          id: string
          metadata: Json | null
          name: string
          organization_id: string | null
          owner_id: string | null
          status: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          complexity?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          metadata?: Json | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          complexity?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_process_maps_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_process_maps_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_process_maps_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_process_nodes: {
        Row: {
          assignee: string | null
          created_at: string | null
          description: string | null
          estimated_time: number | null
          id: string
          label: string
          metadata: Json | null
          node_type: string
          position: Json
          process_map_id: string | null
          status: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: string
          label: string
          metadata?: Json | null
          node_type: string
          position: Json
          process_map_id?: string | null
          status?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: string
          label?: string
          metadata?: Json | null
          node_type?: string
          position?: Json
          process_map_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_process_nodes_process_map_id_fkey"
            columns: ["process_map_id"]
            isOneToOne: false
            referencedRelation: "flow_process_maps"
            referencedColumns: ["id"]
          },
        ]
      }
      foresight_business_levers: {
        Row: {
          created_at: string | null
          current_value: number | null
          id: string
          impact_category: string | null
          lever_type: string | null
          max_value: number | null
          min_value: number | null
          name: string
          proposed_value: number | null
          scenario_id: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          id?: string
          impact_category?: string | null
          lever_type?: string | null
          max_value?: number | null
          min_value?: number | null
          name: string
          proposed_value?: number | null
          scenario_id?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          id?: string
          impact_category?: string | null
          lever_type?: string | null
          max_value?: number | null
          min_value?: number | null
          name?: string
          proposed_value?: number | null
          scenario_id?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foresight_business_levers_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "foresight_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      foresight_impact_assessments: {
        Row: {
          confidence_score: number
          created_at: string | null
          dimension: string
          id: string
          impact_score: number
          metrics: Json | null
          scenario_id: string | null
          trend: string | null
        }
        Insert: {
          confidence_score: number
          created_at?: string | null
          dimension: string
          id?: string
          impact_score: number
          metrics?: Json | null
          scenario_id?: string | null
          trend?: string | null
        }
        Update: {
          confidence_score?: number
          created_at?: string | null
          dimension?: string
          id?: string
          impact_score?: number
          metrics?: Json | null
          scenario_id?: string | null
          trend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foresight_impact_assessments_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "foresight_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      foresight_outcomes: {
        Row: {
          baseline_value: number | null
          confidence_score: number | null
          created_at: string | null
          id: string
          metric_category: string | null
          metric_name: string
          projected_value: number | null
          scenario_id: string | null
          timeline_months: number | null
          variance_percentage: number | null
        }
        Insert: {
          baseline_value?: number | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          metric_category?: string | null
          metric_name: string
          projected_value?: number | null
          scenario_id?: string | null
          timeline_months?: number | null
          variance_percentage?: number | null
        }
        Update: {
          baseline_value?: number | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          metric_category?: string | null
          metric_name?: string
          projected_value?: number | null
          scenario_id?: string | null
          timeline_months?: number | null
          variance_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "foresight_outcomes_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "foresight_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      foresight_risk_factors: {
        Row: {
          created_at: string | null
          id: string
          impact: string | null
          mitigation_strategy: string | null
          name: string
          probability: number | null
          scenario_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          impact?: string | null
          mitigation_strategy?: string | null
          name: string
          probability?: number | null
          scenario_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          impact?: string | null
          mitigation_strategy?: string | null
          name?: string
          probability?: number | null
          scenario_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foresight_risk_factors_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "foresight_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      foresight_scenarios: {
        Row: {
          category: string | null
          confidence_score: number | null
          created_at: string | null
          created_from_template: boolean | null
          description: string | null
          expected_roi: number | null
          id: string
          investment_required: number | null
          metadata: Json | null
          name: string
          organization_id: string | null
          owner_id: string | null
          risk_level: string | null
          status: string | null
          tags: string[] | null
          template_id: string | null
          timeline_months: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          confidence_score?: number | null
          created_at?: string | null
          created_from_template?: boolean | null
          description?: string | null
          expected_roi?: number | null
          id?: string
          investment_required?: number | null
          metadata?: Json | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          risk_level?: string | null
          status?: string | null
          tags?: string[] | null
          template_id?: string | null
          timeline_months?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          confidence_score?: number | null
          created_at?: string | null
          created_from_template?: boolean | null
          description?: string | null
          expected_roi?: number | null
          id?: string
          investment_required?: number | null
          metadata?: Json | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          risk_level?: string | null
          status?: string | null
          tags?: string[] | null
          template_id?: string | null
          timeline_months?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foresight_scenarios_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foresight_scenarios_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      foresight_scenario_variables: {
        Row: {
          category: string
          created_at: string | null
          dependencies: Json | null
          formula: string | null
          id: string
          max_value: number | null
          min_value: number | null
          name: string
          scenario_id: string | null
          unit: string | null
          value: number
          variable_type: string
        }
        Insert: {
          category: string
          created_at?: string | null
          dependencies?: Json | null
          formula?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          name: string
          scenario_id?: string | null
          unit?: string | null
          value: number
          variable_type: string
        }
        Update: {
          category?: string
          created_at?: string | null
          dependencies?: Json | null
          formula?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          name?: string
          scenario_id?: string | null
          unit?: string | null
          value?: number
          variable_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "foresight_scenario_variables_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "foresight_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      foresight_simulation_runs: {
        Row: {
          completed_at: string | null
          confidence_level: number | null
          created_at: string | null
          created_by: string | null
          id: string
          iterations: number | null
          results: Json | null
          scenario_id: string | null
          simulation_type: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          confidence_level?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          iterations?: number | null
          results?: Json | null
          scenario_id?: string | null
          simulation_type: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          confidence_level?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          iterations?: number | null
          results?: Json | null
          scenario_id?: string | null
          simulation_type?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foresight_simulation_runs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foresight_simulation_runs_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "foresight_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      foresight_stakeholder_impacts: {
        Row: {
          confidence_score: number
          created_at: string | null
          description: string | null
          id: string
          impact_score: number
          priority: string | null
          scenario_id: string | null
          stakeholder_group: string
        }
        Insert: {
          confidence_score: number
          created_at?: string | null
          description?: string | null
          id?: string
          impact_score: number
          priority?: string | null
          scenario_id?: string | null
          stakeholder_group: string
        }
        Update: {
          confidence_score?: number
          created_at?: string | null
          description?: string | null
          id?: string
          impact_score?: number
          priority?: string | null
          scenario_id?: string | null
          stakeholder_group?: string
        }
        Relationships: [
          {
            foreignKeyName: "foresight_stakeholder_impacts_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "foresight_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          app: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          message: string | null
          metadata: Json | null
          organization_id: string | null
          priority: string | null
          read_at: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          app: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          read_at?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          app?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          active_products: string[] | null
          ai_coach_enabled: boolean | null
          core_values: Json | null
          created_at: string | null
          id: string
          industry: string | null
          logo_url: string | null
          mission_last_updated: string | null
          mission_statement: string | null
          name: string
          settings: Json | null
          size_category: string | null
          slug: string
          subscription_tier: string | null
          timezone: string | null
          trust_layer_enabled: boolean | null
          updated_at: string | null
          vision_last_updated: string | null
          vision_statement: string | null
          website: string | null
        }
        Insert: {
          active_products?: string[] | null
          ai_coach_enabled?: boolean | null
          core_values?: Json | null
          created_at?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          mission_last_updated?: string | null
          mission_statement?: string | null
          name: string
          settings?: Json | null
          size_category?: string | null
          slug: string
          subscription_tier?: string | null
          timezone?: string | null
          trust_layer_enabled?: boolean | null
          updated_at?: string | null
          vision_last_updated?: string | null
          vision_statement?: string | null
          website?: string | null
        }
        Update: {
          active_products?: string[] | null
          ai_coach_enabled?: boolean | null
          core_values?: Json | null
          created_at?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          mission_last_updated?: string | null
          mission_statement?: string | null
          name?: string
          settings?: Json | null
          size_category?: string | null
          slug?: string
          subscription_tier?: string | null
          timezone?: string | null
          trust_layer_enabled?: boolean | null
          updated_at?: string | null
          vision_last_updated?: string | null
          vision_statement?: string | null
          website?: string | null
        }
        Relationships: []
      }
      pulse_anomalies: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          created_at: string
          description: string | null
          detected_at: string | null
          id: string
          kpi_id: string | null
          metadata: Json | null
          resolved_at: string | null
          severity: string | null
          type: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          description?: string | null
          detected_at?: string | null
          id?: string
          kpi_id?: string | null
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string | null
          type?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          description?: string | null
          detected_at?: string | null
          id?: string
          kpi_id?: string | null
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pulse_anomalies_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulse_anomalies_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "pulse_kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      pulse_dashboard_widgets: {
        Row: {
          config: Json | null
          created_at: string | null
          dashboard_id: string | null
          id: string
          kpi_id: string | null
          position: Json
          size: Json
          title: string
          widget_type: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          kpi_id?: string | null
          position: Json
          size: Json
          title: string
          widget_type: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          kpi_id?: string | null
          position?: Json
          size?: Json
          title?: string
          widget_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pulse_dashboard_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "pulse_dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulse_dashboard_widgets_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "pulse_kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      pulse_dashboards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          layout_config: Json | null
          name: string
          organization_id: string | null
          owner_id: string | null
          refresh_interval: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          layout_config?: Json | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          refresh_interval?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          layout_config?: Json | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          refresh_interval?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pulse_dashboards_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulse_dashboards_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pulse_kpis: {
        Row: {
          api_endpoint: string | null
          auto_update: boolean | null
          benchmark_source: string | null
          benchmark_value: string | null
          category: string | null
          created_at: string | null
          current_value: string | null
          data_source: string | null
          description: string | null
          formula: string | null
          frequency: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          name: string
          organization_id: string | null
          owner_id: string | null
          status: string | null
          tags: string[] | null
          target_value: string | null
          threshold_green: string | null
          threshold_red: string | null
          threshold_yellow: string | null
          trend_direction: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          auto_update?: boolean | null
          benchmark_source?: string | null
          benchmark_value?: string | null
          category?: string | null
          created_at?: string | null
          current_value?: string | null
          data_source?: string | null
          description?: string | null
          formula?: string | null
          frequency?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          status?: string | null
          tags?: string[] | null
          target_value?: string | null
          threshold_green?: string | null
          threshold_red?: string | null
          threshold_yellow?: string | null
          trend_direction?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          auto_update?: boolean | null
          benchmark_source?: string | null
          benchmark_value?: string | null
          category?: string | null
          created_at?: string | null
          current_value?: string | null
          data_source?: string | null
          description?: string | null
          formula?: string | null
          frequency?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          status?: string | null
          tags?: string[] | null
          target_value?: string | null
          threshold_green?: string | null
          threshold_red?: string | null
          threshold_yellow?: string | null
          trend_direction?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pulse_kpis_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulse_kpis_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pulse_kpi_values: {
        Row: {
          confidence_score: number | null
          id: string
          kpi_id: string | null
          metadata: Json | null
          notes: string | null
          period_end: string | null
          period_start: string | null
          recorded_at: string | null
          recorded_by: string | null
          value: string
        }
        Insert: {
          confidence_score?: number | null
          id?: string
          kpi_id?: string | null
          metadata?: Json | null
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          recorded_at?: string | null
          recorded_by?: string | null
          value: string
        }
        Update: {
          confidence_score?: number | null
          id?: string
          kpi_id?: string | null
          metadata?: Json | null
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          recorded_at?: string | null
          recorded_by?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "pulse_kpi_values_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "pulse_kpis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulse_kpi_values_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          department_id: string
          description: string | null
          id: string
          name: string
          organization_id: string
          team_lead_id: string | null
        }
        Insert: {
          created_at?: string | null
          department_id: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          team_lead_id?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          team_lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          department_id: string | null
          email: string
          full_name: string | null
          id: string
          job_title: string | null
          last_active_at: string | null
          organization_id: string | null
          permissions: Json | null
          preferences: Json | null
          role: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          department_id?: string | null
          email: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_active_at?: string | null
          organization_id?: string | null
          permissions?: Json | null
          preferences?: Json | null
          role?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          department_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_active_at?: string | null
          organization_id?: string | null
          permissions?: Json | null
          preferences?: Json | null
          role?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      value_impacts: {
        Row: {
          baseline_value: number | null
          created_at: string | null
          current_value: number | null
          id: string
          impact_category: string | null
          measurement_period: string | null
          metric_name: string | null
          organization_id: string | null
          source_app: string
          source_entity_id: string
          stakeholder_group: string | null
          target_value: number | null
          unit: string | null
          updated_at: string | null
          verification_source: string | null
          verified: boolean | null
        }
        Insert: {
          baseline_value?: number | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          impact_category?: string | null
          measurement_period?: string | null
          metric_name?: string | null
          organization_id?: string | null
          source_app: string
          source_entity_id: string
          stakeholder_group?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          verification_source?: string | null
          verified?: boolean | null
        }
        Update: {
          baseline_value?: number | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          impact_category?: string | null
          measurement_period?: string | null
          metric_name?: string | null
          organization_id?: string | null
          source_app?: string
          source_entity_id?: string
          stakeholder_group?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          verification_source?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "value_impacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

export {};
