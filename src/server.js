import http from 'node:http'
import fs from 'node:fs'
import {parse} from 'csv-parse'

import {json} from './middleware/json.js'
import { routes } from './routes.js'

const server = http.createServer(async(req, res)=> {
    const {method, url} = req
    
    await json(req, res)

    const route = routes.find(route => {
        return route.method == method && route.path.test(url) 
    })

    if(route) {
        const routeParam = req.url.match(route.path)
        const {query, ...params} = routeParam.groups

        req.param = params
        req.query = query ? extractQueryParams(query):{}
        
        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3333, ()=> {
    console.log('task manager inicializado na porta 3333');
    loadCSV()
})

export function loadCSV(){
    fs.createReadStream("./tasks.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
        var task = {
            title: row[0],
            description: row[1]
        };

        await fetch('http://localhost:3333/tasks', {
            method: 'post',
        	body: JSON.stringify(task),
	        headers: {'Content-Type': 'application/json'}
        })
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    console.log("finished");
  });
}