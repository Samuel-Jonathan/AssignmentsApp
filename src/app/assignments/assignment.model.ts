export class Assignment {
    _id?: string;
    id!: number;
    nom !: string;
    dateDeRendu !: Date;
    rendu?: boolean;
    studentId!: Number;
    studentName?: string;
    subjectId!: number;
    subjectName!: string;
    subjectTeacher!: string;
    imgSubject!: string;
    imgTeacher!: string;
    note!: number;
    comment!: string;
}