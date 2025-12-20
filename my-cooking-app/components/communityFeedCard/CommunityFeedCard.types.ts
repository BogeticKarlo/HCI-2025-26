type Story = {
  date: string | number | Date;
  createdBy: string;
  title: string;
  description: string;
  imageUrl: string;
  numberOfLikes: number;
  haveUserLiked: boolean;
};

type CommunityFeedCardProps = {
  story: Story;
  onToggleLike?: (story: Story) => void;
};

export type { CommunityFeedCardProps, Story };
