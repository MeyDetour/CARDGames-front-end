

init :
	php -S localhost:8002 -t .
git-reset:
	sudo rm -R .git
	git init
	git remote add origin https://github.com/MeyDetour/CARD-studio-tester.git
	git add .
	git commit -m "fix git object error"
	git push -uf --set-upstream origin master	



git-resolve:
	find .git/objects/ -type f -empty -delete 
	rm .git/refs/heads/master 
	git fetch origin 
	git checkout -b master origin/master
	git fetch origin