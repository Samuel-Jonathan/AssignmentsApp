export class Assignment {
    _id?: string;
    id!: number;
    nom !: string;
    dateDeRendu !: Date;
    rendu?: boolean;
    studentId!: Number;
    studentName?: string;
}