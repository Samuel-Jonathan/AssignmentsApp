let Assignment = require('../model/assignment');


function getAssignments(req, res) {
    const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
    };

    Assignment.aggregate([
        {
            $lookup: {
                from: 'students', // Assurez-vous que c'est le nom correct de la collection des étudiants dans MongoDB
                localField: 'studentId', // Le champ dans 'assignments' qui contient la référence à 'students'
                foreignField: 'id', // Le champ correspondant dans 'students', généralement '_id'
                as: 'studentDetails' // Le résultat de la jointure sera stocké dans ce nouveau champ
            }
        },
        {
            $unwind: {
                path: '$studentDetails',
                preserveNullAndEmptyArrays: true // Pour garder les assignments qui n'ont pas d'étudiants liés
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
                studentId: 1
            }
        }
    ])
    .then(assignments => {
        res.send(assignments);
    })
    .catch(err => {
        console.error('Error while getting assignments:', err);
        res.status(500).send({ message: 'Error while getting assignments', error: err });
    });
}

  

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;
    Assignment.findOne({ id: assignmentId }, (err, assignment) => {
        if (err) { res.send(err) }
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.studentId = req.body.studentId;
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
