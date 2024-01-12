let Assignment = require('../model/assignment');

function getAssignments(req, res) {
    const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
    };

    var aggregateQuery = Assignment.aggregate([
        {
            $lookup: {
                from: 'students',
                localField: 'studentId',
                foreignField: 'id',
                as: 'studentDetails'
            }
        },
        {
            $unwind: {
                path: '$studentDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'subjects', 
                localField: 'subjectId', 
                foreignField: 'id', 
                as: 'subjectDetails' 
            }
        },
        {
            $unwind: {
                path: '$subjectDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                id: 1,
                studentName: {
                    $concat: [
                        '$studentDetails.first_name', ' ', '$studentDetails.last_name'
                    ]
                },
                dateDeRendu: 1,
                nom: 1,
                rendu: 1,
                subject: 1,
                studentId: 1,
                subjectName: '$subjectDetails.name', // Champ "name" de la table "subject"
                subjectTeacher: '$subjectDetails.teacher' // Champ "teacher" de la table "subject"
            }
        }
    ]);

    Assignment.aggregatePaginate(
        aggregateQuery,
        options,
        (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
}




// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;

    Assignment.aggregate([
        { $match: { id: parseInt(assignmentId, 10) } },
        {
            $lookup: {
                from: 'students',
                localField: 'studentId',
                foreignField: 'id',
                as: 'studentDetails'
            }
        },
        { $unwind: '$studentDetails' },
        {
            $lookup: {
                from: 'subjects',
                localField: 'subjectId',
                foreignField: 'id',
                as: 'subjectDetails'
            }
        },
        { $unwind: '$subjectDetails' },
        {
            $project: {
                _id: 1,
                id: 1,
                studentName: { $concat: ['$studentDetails.first_name', ' ', '$studentDetails.last_name'] },
                dateDeRendu: 1,
                nom: 1,
                rendu: 1,
                subject: 1,
                studentId: 1,
                subjectName: '$subjectDetails.name',
                subjectTeacher: '$subjectDetails.teacher',
                note: 1,
                comment: 1
            }
        }
    ]).exec((err, assignment) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(assignment[0] || {});
        }
    });
}


// Ajout d'un assignment (POST)
function postAssignment(req, res) {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.studentId = req.body.studentId;
    assignment.subjectId = req.body.subjectId;
    assignment.note = req.body.note;
    assignment.comment = req.body.comment;
    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save((err) => {
        if (err) {
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!` })
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            res.send(err)
        } else {
            res.json({ message: 'updated' })
        }
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${assignment.nom} deleted` });
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
