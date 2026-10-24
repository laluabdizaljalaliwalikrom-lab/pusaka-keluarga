export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type FamilyRole = 'owner' | 'family_admin' | 'editor' | 'contributor' | 'reader';
export type MembershipStatus = 'invited' | 'active' | 'suspended';
export type Gender = 'male' | 'female' | 'unknown' | 'other';
export type DateAccuracy = 'EXACT' | 'APPROXIMATE' | 'BEFORE' | 'AFTER' | 'BETWEEN' | 'UNKNOWN';
export type NameType = 'alias' | 'birth_name' | 'married_name' | 'title' | 'religious_name' | 'posthumous_name';
export type UnionType = 'marriage' | 'civil_union' | 'religious' | 'customary' | 'unmarried' | 'unknown';
export type UnionStatus = 'active' | 'divorced' | 'annulled' | 'widowed' | 'separated' | 'unknown';
export type RelationshipType = 'biological' | 'adopted' | 'step' | 'foster' | 'guardian' | 'unknown';
export type RelationshipConfidence = 'verified' | 'probable' | 'uncertain' | 'disputed';
export type ClaimStatus = 'belum_ditinjau' | 'sedang_ditinjau' | 'diterima' | 'diperdebatkan' | 'ditolak';
export type EvidenceQuality = 'direct' | 'indirect' | 'hearsay' | 'questionable';
export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type AuditOperation = 'INSERT' | 'UPDATE' | 'DELETE' | 'MERGE' | 'APPROVE_PROPOSAL' | 'REJECT_PROPOSAL';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          is_superadmin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          is_superadmin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          is_superadmin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      families: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          cover_image_url: string | null;
          root_person_id: string | null;
          is_private: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          cover_image_url?: string | null;
          root_person_id?: string | null;
          is_private?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          cover_image_url?: string | null;
          root_person_id?: string | null;
          is_private?: boolean;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      family_memberships: {
        Row: {
          id: string;
          family_id: string;
          profile_id: string;
          role: FamilyRole;
          status: MembershipStatus;
          invited_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          profile_id: string;
          role: FamilyRole;
          status?: MembershipStatus;
          invited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          profile_id?: string;
          role?: FamilyRole;
          status?: MembershipStatus;
          invited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      persons: {
        Row: {
          id: string;
          family_id: string;
          primary_name: string;
          nickname: string | null;
          gender: Gender;
          is_living: boolean;
          birth_date_exact: string | null;
          birth_date_year: number | null;
          birth_date_type: DateAccuracy;
          birth_date_text: string | null;
          birth_place_id: string | null;
          death_date_exact: string | null;
          death_date_year: number | null;
          death_date_type: DateAccuracy;
          death_date_text: string | null;
          death_place_id: string | null;
          burial_place_id: string | null;
          bio: string | null;
          avatar_media_id: string | null;
          is_private: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          primary_name: string;
          nickname?: string | null;
          gender: Gender;
          is_living?: boolean;
          birth_date_exact?: string | null;
          birth_date_year?: number | null;
          birth_date_type?: DateAccuracy;
          birth_date_text?: string | null;
          birth_place_id?: string | null;
          death_date_exact?: string | null;
          death_date_year?: number | null;
          death_date_type?: DateAccuracy;
          death_date_text?: string | null;
          death_place_id?: string | null;
          burial_place_id?: string | null;
          bio?: string | null;
          avatar_media_id?: string | null;
          is_private?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          primary_name?: string;
          nickname?: string | null;
          gender?: Gender;
          is_living?: boolean;
          birth_date_exact?: string | null;
          birth_date_year?: number | null;
          birth_date_type?: DateAccuracy;
          birth_date_text?: string | null;
          birth_place_id?: string | null;
          death_date_exact?: string | null;
          death_date_year?: number | null;
          death_date_type?: DateAccuracy;
          death_date_text?: string | null;
          death_place_id?: string | null;
          burial_place_id?: string | null;
          bio?: string | null;
          avatar_media_id?: string | null;
          is_private?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      person_names: {
        Row: {
          id: string;
          person_id: string;
          name: string;
          type: NameType;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          person_id: string;
          name: string;
          type: NameType;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          person_id?: string;
          name?: string;
          type?: NameType;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      places: {
        Row: {
          id: string;
          family_id: string;
          name: string;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          name: string;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          name?: string;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      unions: {
        Row: {
          id: string;
          family_id: string;
          type: UnionType;
          status: UnionStatus;
          start_date_exact: string | null;
          start_date_year: number | null;
          start_date_type: DateAccuracy;
          start_date_text: string | null;
          end_date_exact: string | null;
          end_date_year: number | null;
          end_date_type: DateAccuracy;
          end_date_text: string | null;
          place_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          type?: UnionType;
          status?: UnionStatus;
          start_date_exact?: string | null;
          start_date_year?: number | null;
          start_date_type?: DateAccuracy;
          start_date_text?: string | null;
          end_date_exact?: string | null;
          end_date_year?: number | null;
          end_date_type?: DateAccuracy;
          end_date_text?: string | null;
          place_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          type?: UnionType;
          status?: UnionStatus;
          start_date_exact?: string | null;
          start_date_year?: number | null;
          start_date_type?: DateAccuracy;
          start_date_text?: string | null;
          end_date_exact?: string | null;
          end_date_year?: number | null;
          end_date_type?: DateAccuracy;
          end_date_text?: string | null;
          place_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      union_participants: {
        Row: {
          id: string;
          union_id: string;
          person_id: string;
          role: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          union_id: string;
          person_id: string;
          role?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          union_id?: string;
          person_id?: string;
          role?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      parent_child_relationships: {
        Row: {
          id: string;
          family_id: string;
          parent_id: string;
          child_id: string;
          union_id: string | null;
          relationship_type: RelationshipType;
          confidence: RelationshipConfidence;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          parent_id: string;
          child_id: string;
          union_id?: string | null;
          relationship_type?: RelationshipType;
          confidence?: RelationshipConfidence;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          parent_id?: string;
          child_id?: string;
          union_id?: string | null;
          relationship_type?: RelationshipType;
          confidence?: RelationshipConfidence;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      sources: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          author: string | null;
          publication_date: string | null;
          repository: string | null;
          source_type: string;
          citation_text: string | null;
          url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          title: string;
          author?: string | null;
          publication_date?: string | null;
          repository?: string | null;
          source_type: string;
          citation_text?: string | null;
          url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          title?: string;
          author?: string | null;
          publication_date?: string | null;
          repository?: string | null;
          source_type?: string;
          citation_text?: string | null;
          url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      claims: {
        Row: {
          id: string;
          family_id: string;
          subject_person_id: string | null;
          claim_type: string;
          predicate: string;
          raw_data: Json;
          status: ClaimStatus;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          subject_person_id?: string | null;
          claim_type: string;
          predicate: string;
          raw_data?: Json;
          status?: ClaimStatus;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          subject_person_id?: string | null;
          claim_type?: string;
          predicate?: string;
          raw_data?: Json;
          status?: ClaimStatus;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      claim_sources: {
        Row: {
          id: string;
          claim_id: string;
          source_id: string;
          page_or_reference: string | null;
          evidence_quality: EvidenceQuality;
          created_at: string;
        };
        Insert: {
          id?: string;
          claim_id: string;
          source_id: string;
          page_or_reference?: string | null;
          evidence_quality?: EvidenceQuality;
          created_at?: string;
        };
        Update: {
          id?: string;
          claim_id?: string;
          source_id?: string;
          page_or_reference?: string | null;
          evidence_quality?: EvidenceQuality;
          created_at?: string;
        };
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          family_id: string;
          person_id: string | null;
          source_id: string | null;
          storage_path: string;
          file_name: string;
          file_type: string;
          file_size_bytes: number;
          caption: string | null;
          is_private: boolean;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          person_id?: string | null;
          source_id?: string | null;
          storage_path: string;
          file_name: string;
          file_type: string;
          file_size_bytes: number;
          caption?: string | null;
          is_private?: boolean;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          person_id?: string | null;
          source_id?: string | null;
          storage_path?: string;
          file_name?: string;
          file_type?: string;
          file_size_bytes?: number;
          caption?: string | null;
          is_private?: boolean;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          event_type: string;
          date_exact: string | null;
          date_year: number | null;
          date_type: DateAccuracy;
          date_text: string | null;
          place_id: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          title: string;
          event_type: string;
          date_exact?: string | null;
          date_year?: number | null;
          date_type?: DateAccuracy;
          date_text?: string | null;
          place_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          title?: string;
          event_type?: string;
          date_exact?: string | null;
          date_year?: number | null;
          date_type?: DateAccuracy;
          date_text?: string | null;
          place_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      event_persons: {
        Row: {
          id: string;
          event_id: string;
          person_id: string;
          role_in_event: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          person_id: string;
          role_in_event?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          person_id?: string;
          role_in_event?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      change_proposals: {
        Row: {
          id: string;
          family_id: string;
          target_table: string;
          target_id: string | null;
          operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'MERGE';
          proposed_payload: Json;
          justification: string;
          source_id: string | null;
          status: ProposalStatus;
          proposed_by: string;
          reviewed_by: string | null;
          reviewer_notes: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          target_table: string;
          target_id?: string | null;
          operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'MERGE';
          proposed_payload: Json;
          justification: string;
          source_id?: string | null;
          status?: ProposalStatus;
          proposed_by: string;
          reviewed_by?: string | null;
          reviewer_notes?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          target_table?: string;
          target_id?: string | null;
          operation?: 'INSERT' | 'UPDATE' | 'DELETE' | 'MERGE';
          proposed_payload?: Json;
          justification?: string;
          source_id?: string | null;
          status?: ProposalStatus;
          proposed_by?: string;
          reviewed_by?: string | null;
          reviewer_notes?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          family_id: string;
          table_name: string;
          record_id: string;
          operation: AuditOperation;
          actor_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          change_summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          table_name: string;
          record_id: string;
          operation: AuditOperation;
          actor_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          change_summary?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          table_name?: string;
          record_id?: string;
          operation?: AuditOperation;
          actor_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          change_summary?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      fn_check_parent_child_cycle: {
        Args: {
          p_parent_id: string;
          p_child_id: string;
        };
        Returns: boolean;
      };
      fn_add_parent_child_relationship: {
        Args: {
          p_family_id: string;
          p_parent_id: string;
          p_child_id: string;
          p_union_id?: string | null;
          p_relationship_type?: RelationshipType;
          p_confidence?: RelationshipConfidence;
          p_notes?: string | null;
        };
        Returns: string;
      };
      fn_get_ancestors: {
        Args: {
          p_person_id: string;
          p_max_depth?: number;
        };
        Returns: {
          person_id: string;
          primary_name: string;
          gender: Gender;
          birth_year: number | null;
          death_year: number | null;
          is_living: boolean;
          avatar_url: string | null;
          depth: number;
          relationship_type: RelationshipType;
          child_id: string;
        }[];
      };
      fn_get_descendants: {
        Args: {
          p_person_id: string;
          p_max_depth?: number;
        };
        Returns: {
          person_id: string;
          primary_name: string;
          gender: Gender;
          birth_year: number | null;
          death_year: number | null;
          is_living: boolean;
          avatar_url: string | null;
          depth: number;
          relationship_type: RelationshipType;
          parent_id: string;
        }[];
      };
      get_family_subgraph: {
        Args: {
          p_person_id: string;
          p_ancestor_depth?: number;
          p_descendant_depth?: number;
        };
        Returns: Json;
      };
      fn_merge_persons: {
        Args: {
          p_family_id: string;
          p_source_person_id: string;
          p_target_person_id: string;
          p_actor_id: string;
        };
        Returns: Json;
      };
      is_family_member: {
        Args: {
          p_family_id: string;
        };
        Returns: boolean;
      };
      has_family_role: {
        Args: {
          p_family_id: string;
          p_required_roles: string[];
        };
        Returns: boolean;
      };
    };
    Enums: {
      family_role_type: FamilyRole;
      membership_status_type: MembershipStatus;
      gender_type: Gender;
      date_accuracy_type: DateAccuracy;
      name_category_type: NameType;
      union_category_type: UnionType;
      union_status_type: UnionStatus;
      relationship_category_type: RelationshipType;
      confidence_type: RelationshipConfidence;
      claim_status_type: ClaimStatus;
      evidence_quality_type: EvidenceQuality;
      proposal_status_type: ProposalStatus;
      audit_operation_type: AuditOperation;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

