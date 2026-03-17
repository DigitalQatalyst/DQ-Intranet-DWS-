export interface User {
    id: string;
    name: string;
    initials: string;
    color: string;
  }
  
  export interface LeaveRequestForm {
    requestName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    approvers: User[];
    reason: string;
  }
  
  export enum LeaveType {
    ANNUAL = 'Annual',
    SICK = 'Sick',
    COMPASSIONATE = 'Compassionate',
    MATERNITY = 'Maternity',
    SHORT_TIME_OFF = 'Short Time Off',
  }