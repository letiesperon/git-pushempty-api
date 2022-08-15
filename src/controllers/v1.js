const { Router } = require('express')

const router = Router()

const apiPassword = process.env.API_PASSWORD
const githubUsername = process.env.GITHUB_USERNAME
const githubToken = process.env.GITHUB_TOKEN
const organizationName = process.env.GITHUB_ORGANIZATION_NAME
const commitAuthorName = process.env.COMMIT_AUTHOR_NAME
const commitAuthorEmail = process.env.COMMIT_AUTHOR_EMAIL
const commitMessage = process.env.COMMIT_MESSAGE || 'Empty commit!'
const remoteName = 'origin'

router.post('/commit', async (req, res) => {
  const { branch, password, repo } = req.body

  if (!repo) {
    return res.status(400).json({ error: 'Must provide a repo' })
  }

  if (!branch) {
    return res.status(400).json({ error: 'Must provide a branch' })
  }

  if (apiPassword !== password) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  req.log.info('Starting to push empty commit for %s: %s...', repo, branch)

  try {
    await pushEmpty(repo, branch, req)
    return res.status(200).json({ repo, branch, message: 'You got it!' })
  } catch (exception) {
    req.log.error(exception)
    return res.status(500).json({ repo, branch, exception: exception.message })
  }
})

async function pushEmpty (repo, branch, req) {
  const simpleGit = require('simple-git')
  const gitClient = simpleGit()
  gitClient.clean(simpleGit.CleanOptions.FORCE)

  const remoteUrl = `https://${githubUsername}:${githubToken}@github.com/${organizationName}/${repo}`

  try {
    await gitClient.clone(remoteUrl, ['--no-checkout'])
  } catch (ex) {
    req.log.info(`Failed to clone repo ${remoteUrl}: ${ex}. SKIPPING...`)
  }

  await gitClient
    .cwd(repo)
    .addConfig('user.email', commitAuthorEmail)
    .addConfig('user.name', commitAuthorName)
    .addConfig('checkout.defaultRemote', remoteName)
    .fetch(remoteName)
    .checkout(branch)
    .commit(commitMessage, [], {
      '--allow-empty': null,
      '--author': `${commitAuthorName} <${commitAuthorEmail}>"`
    })
    .push([remoteName, branch])
}

module.exports = router
