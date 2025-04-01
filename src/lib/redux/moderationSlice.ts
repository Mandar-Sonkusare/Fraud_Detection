
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, generateMockPosts } from '@/lib/mock-data';

interface ModeractionState {
  posts: Post[];
  whitelist: string[]; // usernames
  blacklist: string[]; // usernames
  stats: {
    approved: number;
    rejected: number;
    pending: number;
    totalFlagged: number;
    approvalRate: number;
    rejectionRate: number;
  };
}

const initialState: ModeractionState = {
  posts: generateMockPosts(30),
  whitelist: [],
  blacklist: [],
  stats: {
    approved: 0,
    rejected: 0,
    pending: 0,
    totalFlagged: 0,
    approvalRate: 0,
    rejectionRate: 0,
  }
};

// Calculate initial stats
initialState.stats.approved = initialState.posts.filter(p => p.status === 'approved').length;
initialState.stats.rejected = initialState.posts.filter(p => p.status === 'rejected').length;
initialState.stats.pending = initialState.posts.filter(p => p.status === 'pending').length;
initialState.stats.totalFlagged = initialState.posts.length;
initialState.stats.approvalRate = initialState.stats.approved / initialState.stats.totalFlagged;
initialState.stats.rejectionRate = initialState.stats.rejected / initialState.stats.totalFlagged;

export const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {
    approvePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        // Store the original status before updating
        const originalStatus = post.status;
        
        // Only proceed if not already approved
        if (originalStatus !== 'approved') {
          post.status = 'approved';
          state.stats.approved++;
          
          // Decrement the appropriate counter based on original status
          if (originalStatus === 'pending') {
            state.stats.pending--;
          } else if (originalStatus === 'rejected') {
            state.stats.rejected--;
          }
          
          // Update rates
          state.stats.approvalRate = state.stats.approved / state.stats.totalFlagged;
          state.stats.rejectionRate = state.stats.rejected / state.stats.totalFlagged;
        }
      }
    },
    rejectPost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        // Store the original status before updating
        const originalStatus = post.status;
        
        // Only proceed if not already rejected
        if (originalStatus !== 'rejected') {
          post.status = 'rejected';
          state.stats.rejected++;
          
          // Decrement the appropriate counter based on original status
          if (originalStatus === 'pending') {
            state.stats.pending--;
          } else if (originalStatus === 'approved') {
            state.stats.approved--;
          }
          
          // Update rates
          state.stats.approvalRate = state.stats.approved / state.stats.totalFlagged;
          state.stats.rejectionRate = state.stats.rejected / state.stats.totalFlagged;
        }
      }
    },
    addToWhitelist: (state, action: PayloadAction<string>) => {
      if (!state.whitelist.includes(action.payload)) {
        state.whitelist.push(action.payload);
        // Auto-approve all pending posts from this user
        state.posts.forEach(post => {
          if (post.username === action.payload && post.status === 'pending') {
            post.status = 'approved';
            state.stats.approved++;
            state.stats.pending--;
            state.stats.approvalRate = state.stats.approved / state.stats.totalFlagged;
            state.stats.rejectionRate = state.stats.rejected / state.stats.totalFlagged;
          }
        });
      }
    },
    addToBlacklist: (state, action: PayloadAction<string>) => {
      if (!state.blacklist.includes(action.payload)) {
        state.blacklist.push(action.payload);
        // Auto-reject all pending posts from this user
        state.posts.forEach(post => {
          if (post.username === action.payload && post.status === 'pending') {
            post.status = 'rejected';
            state.stats.rejected++;
            state.stats.pending--;
            state.stats.approvalRate = state.stats.approved / state.stats.totalFlagged;
            state.stats.rejectionRate = state.stats.rejected / state.stats.totalFlagged;
          }
        });
      }
    },
    bulkApprove: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        const post = state.posts.find(p => p.id === id);
        if (post) {
          // Store the original status before updating
          const originalStatus = post.status;
          
          // Only proceed if not already approved
          if (originalStatus !== 'approved') {
            post.status = 'approved';
            state.stats.approved++;
            
            // Decrement the appropriate counter based on original status
            if (originalStatus === 'pending') {
              state.stats.pending--;
            } else if (originalStatus === 'rejected') {
              state.stats.rejected--;
            }
          }
        }
      });
      state.stats.approvalRate = state.stats.approved / state.stats.totalFlagged;
      state.stats.rejectionRate = state.stats.rejected / state.stats.totalFlagged;
    },
    bulkReject: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        const post = state.posts.find(p => p.id === id);
        if (post) {
          // Store the original status before updating
          const originalStatus = post.status;
          
          // Only proceed if not already rejected
          if (originalStatus !== 'rejected') {
            post.status = 'rejected';
            state.stats.rejected++;
            
            // Decrement the appropriate counter based on original status
            if (originalStatus === 'pending') {
              state.stats.pending--;
            } else if (originalStatus === 'approved') {
              state.stats.approved--;
            }
          }
        }
      });
      state.stats.approvalRate = state.stats.approved / state.stats.totalFlagged;
      state.stats.rejectionRate = state.stats.rejected / state.stats.totalFlagged;
    },
    addNewFlaggedPost: (state, action: PayloadAction<Post>) => {
      // Check if post already exists
      if (!state.posts.some(p => p.id === action.payload.id)) {
        state.posts.unshift(action.payload);
        state.stats.pending++;
        state.stats.totalFlagged++;
        state.stats.approvalRate = state.stats.approved / state.stats.totalFlagged;
        state.stats.rejectionRate = state.stats.rejected / state.stats.totalFlagged;
      }
    }
  },
});

export const { 
  approvePost, 
  rejectPost, 
  addToWhitelist, 
  addToBlacklist, 
  bulkApprove, 
  bulkReject,
  addNewFlaggedPost 
} = moderationSlice.actions;

export default moderationSlice.reducer;
