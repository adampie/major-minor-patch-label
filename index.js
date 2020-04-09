const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
    try {
        const token = core.getInput('TOKEN');

        if (token === "") {
            core.setFailed("Missing TOKEN secret!");
        }

        const client = new github.GitHub(token);
        const context = github.context;

        const {data: pr} = await client.pulls.get({
            owner: context.issue.owner,
            repo: context.issue.repo,
            pull_number: context.issue.number
        });

        let major = false;
        let minor = false;
        let patch = false;
        let len = pr.labels.length;
        let str = '';

        for (let i = 0; i < len; i++) {
            switch(pr.labels[i].name) {
                case "major":
                    major = true
                    str += 'MAJOR, '
                    break;
                case "minor":
                    minor = true
                    str += 'MINOR, '
                    break;
                case "patch":
                    patch = true
                    str += 'PATCH, '
                    break;
            }
        }

        let count = !!major + !!minor + !!patch;

        if (count === 0) {
            core.setFailed("Missing MAJOR, MINOR or PATCH label!");
        }

        if (count > 1) {
            core.setFailed('Found labels '+str+'only a single label allowed!');
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();