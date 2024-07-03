for branch in $(git branch | grep -v "main" | sed 's/*//'); do
  git checkout $branch
  git merge main
  git push origin $branch
done
