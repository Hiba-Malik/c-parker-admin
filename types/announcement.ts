export interface Announcement {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  isHidden: boolean;
}

export interface CreateAnnouncementDTO {
  title: string;
  body: string;
}

export interface UpdateAnnouncementDTO {
  title?: string;
  body?: string;
  isHidden?: boolean;
}



