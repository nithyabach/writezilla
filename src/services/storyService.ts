import { generateClient } from 'aws-amplify/api';
import { createStory, updateStory, deleteStory } from '../graphql/mutations';
import { getStory, listStories } from '../graphql/queries';
import { getCurrentUser } from 'aws-amplify/auth';

export interface Story {
  id: string;
  title: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
}

export interface CreateStoryInput {
  title: string;
  color: string;
  userId: string;
}

const client = generateClient();

export class StoryService {
  static async getCurrentUserId(): Promise<string> {
    try {
      const user = await getCurrentUser();
      return user.userId;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new Error('User not authenticated');
    }
  }

  static async createStory(input: CreateStoryInput): Promise<Story> {
    try {
      const result = await client.graphql({
        query: createStory,
        variables: {
          input: {
            title: input.title,
            color: input.color,
            userId: input.userId,
          }
        }
      });

      return result.data.createStory;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }

  static async getUserStories(userId: string): Promise<Story[]> {
    try {
      const result = await client.graphql({
        query: listStories,
        variables: {
          filter: {
            userId: {
              eq: userId
            }
          }
        }
      });

      return result.data.listStories.items;
    } catch (error) {
      console.error('Error fetching user stories:', error);
      throw error;
    }
  }

  static async deleteStory(id: string, version?: number): Promise<void> {
    try {
      console.log('Attempting to delete story with ID:', id, 'version:', version);
      const input: any = { id };
      if (version !== undefined) {
        input._version = version;
      }
      
      const result = await client.graphql({
        query: deleteStory,
        variables: {
          input
        }
      });
      console.log('Delete story result:', result);
      console.log('Delete story data:', result.data);
      console.log('Delete story errors:', result.errors);
      if (result.data?.deleteStory) {
        console.log('Deleted story details:', JSON.stringify(result.data.deleteStory, null, 2));
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  static async updateStory(id: string, updates: Partial<Story>): Promise<Story> {
    try {
      const result = await client.graphql({
        query: updateStory,
        variables: {
          input: {
            id,
            ...updates
          }
        }
      });

      return result.data.updateStory;
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  }
} 