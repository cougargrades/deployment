import { createWriteStream, mkdirSync } from 'fs'
import { join } from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'
import got from 'got'
//import fetch from 'node-fetch'
import tar from 'tar'

export async function downloadFile(url: string, path: string) {
  console.log(`Downloading ${url} to ${join(process.cwd(), path)}`)
  const streamPipeline = promisify(pipeline)

  // const response = await fetch(url);
  // if (!response.ok || response.body === null) {
  //   throw new Error(`unexpected response ${response.statusText}`);
  // }
  await streamPipeline(got.stream(url), createWriteStream(path))
  console.log(`Download completed for ${join(process.cwd(), path)}`)
}

export async function extractBundle(tarFile: string, outputDirectory: string) {
  console.log(`Extracting bundle ${tarFile}`)
  mkdirSync(outputDirectory, { recursive: true })
  await tar.x({
    file: tarFile,
    C: outputDirectory
  })
  console.log(`Extraction complete for ${tarFile}`)
}
