export type Task = {
  id: string;
  orgId?: string;
  title: string;
  shortDescription: string;
  description?: string;
  language?: string;
  tags: string[];
  estimatedMinutes?: number;
  createdAt?: string;
};

export type Claim = {
  id: string;
  taskId: string;
  userId?: string;
  notes?: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt?: string;
};

export type Badge = {
  id: string;
  userId: string;
  taskId?: string;
  label: string;
  color?: string;
  awardedAt: string;
};

