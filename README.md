This is a tool to extract GitHub usernames from a known set of email
addresses. It works even if the users' emails are not public.


## The problem

It doesn't seem to be possible, either using the advanced search features,
or the API, to directly look up a github username by a known email address,
if that user has chosen not to make that email address public.

But, if they've associated it with their account, even if they haven't made
it public, then *git commits* that they've made to repositories, that use
that email address, are linked to their user accounts. And, as it happens,
when you access the commits of that repo with the API, the usernames show
up there, too.

So this tool works by creating a dummy repo, with git commits that use
the email address that you have in your list. You can then push that repo
up to GitHub, access the API to scrape the usernames, and then, if you
want, delete the repo. So far, this isn't completely automated, but there's
no reason it couldn't be.


## Using get-github-usernames

Put the email addresses you want into a file named `users.txt, and
then run ./index.js.

This creates a dummy git repository, and then makes a commit in it
for each of the email addresses in the list.

When it's done (the following steps are manual so far):

* push the dummy-repo up to GitHub; e.g. klortho/dummy-repo,
* Access the GitHub API to get the usernames; e.g.
  [https://api.github.com/repos/klortho/dummy-repo/commits](https://api.github.com/repos/klortho/dummy-repo/commits)
* If there is a user that has that email address, then the username will
  be in the `author/login` field for that commit. Cross-reference to the
  email in the `commit/author/email` field.


## To do

* It shouldn't wipe out the dummy repo every time; it should first check it
  to see which emails already have commits, and then only add commits for
  those that don't.

* Automate:

    * Pushing the repo to github (take the github repo url as a
      command-line param, or in a config file).
    * Reading the commits from the API and producing the report

## License

<a href='http://www.wtfpl.net/'><img src='https://raw.githubusercontent.com/Klortho/dtd-diagram/28476aa90574bbedef999d8f88b0ead9dac2a819/wtfpl-badge-1.png'/></a>

See [LICENSE.txt](LICENSE.txt).
