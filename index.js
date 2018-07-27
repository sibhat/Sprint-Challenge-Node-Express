const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
 
const server = express();
server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

// Database
const projectDb = require('./data/helpers/projectModel');
const actionDb = require('./data/helpers/actionModel');

// Get /projects
server.get('/projects', (req, res, next)=>{
    projectDb.get()
    .then(result => res.status(200).json({result: result}))
    .catch(eror => next({code: 500, message: eror.message}))
})

// Get /projects with Id
server.get('/projects/:id', (req, res, next)=>{
    projectDb.get(req.params.id)
    .then(result => {
        projectDb.getProjectActions(req.params.id)
        .then(resultWithActions =>res.status(200).json({result: result}))
    })
    
    .catch(eror => next({code: 500, message: eror.message}))
})

// post /project
server.post('/projects', (req, res, next)=>{
    let postProject = req.body;
    if(postProject){
        if (postProject.name){
            if(postProject.name.length > 128){
                next({code: 400, message: 'name shouldnt be londer than 128 char'});
            }
        }else{
            next({code: 400, message: 'name missing'})
        }

        postProject.description ? null : next({code: 400, message: 'description missing'})
    }

    projectDb.insert(postProject)
    .then(result => res.status(200).json({result}))
    .catch(error => next({code: 500, message: error.message}) );
})
// update /project with Id
server.put('/projects/:id', (req, res, next)=>{
    let updateProject = req.body;
    let id = req.params.id;
    id ? null : next ({code: 400, message: 'id is reqired for an update'});

    if(updateProject){
        if (updateProject.name){
            if(updateProject.name.length > 128){
                next({code: 400, message: 'name shouldnt be londer than 128 char'});
            }
        }else{
            next({code: 400, message: 'name missing'})
        }

        updateProject.description ? null : next({code: 400, message: 'description missing'})
    }

    projectDb.update(id, updateProject)
    .then(result => result ? res.status(200).json({result}) : next ({code: 400, message: 'cant find the index your are looking for'}) )
    .catch(error => next({code: 500, message: error.message}) );
})

// Delete /project with Id
server.delete('/projects/:id', (req, res, next)=>{
    let id = req.params.id;
    id ? null : next ({code: 400, message: 'id is reqired for an update'});

    projectDb.remove(id)
    .then(result => result ? res.status(200).json({result: `id #${id} has been deleted`}) : next ({code: 400, message: 'cant find the index your are looking for'}) )
    .catch(error => next({code: 500, message: error.message}) );
})


// Get actions
server.get('/actions', (req, res, next)=>{
    actionDb.get()
    .then(result => res.status(200).json({result: result}))
    .catch(error => next({code: 500, message: error.message}))
    
})
// Get action with Id
server.get('/actions/:id', (req, res, next)=>{
    actionDb.get(req.params.id)
    .then(result => res.status(200).json({result: result}))
    .catch(error => next({code: 500, message: error.message}))
})

// Post action
server.post('/actions', (req, res, next)=>{
    let postAction = req.body;
    if(postAction){
        if (postAction.description){
            if(postAction.description.length > 128){
                next({code: 400, message: 'description shouldnt be londer than 128 char'});
            }
        }else{
            next({code: 400, message: 'description missing'})
        }
        postAction.project_id ? null : next({code: 400, message: 'project_id missing'})
        postAction.notes ? null : next({code: 400, message: 'note missing'})
    }

    actionDb.insert(postAction)
    .then(result => res.status(200).json({result}))
    .catch(error => next({code: 500, message: error.message}) );
})

// Update action with id
server.put('/actions/:id', (req, res, next)=>{
    let updateAction = req.body;
    let id = req.params.id;
    id ? null : next ({code: 400, message: 'id is reqired for an update'});

    if(updateAction){
        if (updateAction.description){
            if(updateAction.description.length > 128){
                next({code: 400, message: 'description shouldnt be londer than 128 char'});
            }
        }else{
            next({code: 400, message: 'description missing'})
        }
        updateAction.project_id ? null : next({code: 400, message: 'project_id missing'})
        postAction.note ? null : next({code: 400, message: 'note missing'})
    }

    actionDb.update(id, updateAction)
    .then(result => result ? res.status(200).json({result}) : next ({code: 400, message: 'cant find the index your are looking for'}) )
    .catch(error => next({code: 500, message: error.message}) );
})

//  Delete action with id
server.delete('/actions/:id', (req, res, next)=>{
    let id = req.params.id;
    id ? null : next ({code: 400, message: 'id is reqired for an update'});

    actionDb.remove(id)
    .then(result => result ? res.status(200).json({result: `id #${id} has been deleted`}) : next ({code: 400, message: 'cant find the index your are looking for'}) )
    .catch(error => next({code: 500, message: error.message}) );
})




server.use((err, req, res, next)=>{
    res.status(err.code).json({message: err.message, code: err.code})
})


const PORT = 8000;
 server.listen(PORT, () => console.log(`API is running at port ${PORT}`))