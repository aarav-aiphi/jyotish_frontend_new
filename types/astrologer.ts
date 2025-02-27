export interface User {
    _id: string;
    name: string;
    avatar: string;
  }
  
  export interface Specialization {
    specialization: {
      name: string;
    };
  }
  
  export interface Ratings {
    average: number;
  }
  
  export interface AstrologerData {
    _id: string;
    user: User;
    specializations: Specialization[];
    languages: string[];
    experience: number;
    costPerMinute: number;
    averageRating?: Ratings;
  }
  