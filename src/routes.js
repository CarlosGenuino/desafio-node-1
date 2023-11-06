import {randomUUID } from 'node:crypto'
import {parse} from 'csv-parse'
import fs from 'node:fs'
import { Database } from './database.js'
import { buildRoutePath } from './util/build-route-path.js'


const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: ((req, res) => {
            const tasks = database.select('tasks')
            return res.end(JSON.stringify(tasks))
        })
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: ((req, res)=> {
            const {title, description} = req.body
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
            }

            database.insert("tasks", task)
            return res.writeHead(201).end('Task_Created')
        })
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            console.log(req.body)
            const {title, description} = req.body

            database.update("tasks", req.param.id, {title, description})
            res
            .writeHead(204)
            .end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            database.delete("tasks", req.param.id)
            res
            .writeHead(204)
            .end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/completed'),
        handler: (req, res) => {
            const data = database.findById("tasks", req.param.id)
            data.completed_at = new Date()
            database.update("tasks", req.param.id, data)
            res.writeHead(204).end()
        }
    }
]

