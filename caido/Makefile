travis_install:
	npm cache clean
	npm install
	npm install http-server -g

travis_script:
	npm run lint
	npm run build
	http-server dist -p 5050 > /dev/null &
	sleep 1
	npm test

travis_after_success:

travis: travis_install travis_script travis_after_success

.PHONY: travis_install travis_script travis_after_success travis
