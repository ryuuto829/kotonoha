import type { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD']
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

// API Routes example with CORS
// https://github.com/vercel/next.js/tree/canary/examples/api-routes-cors
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  const params = req.query

  const data = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${params.keyword}`
  )
  const json = await data.json()

  res.json(json)
}
