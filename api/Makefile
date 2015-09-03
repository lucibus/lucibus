SHELL = /bin/sh

VALIDATORS := $(basename $(notdir $(wildcard validators/*.Dockerfile)))

build: ${VALIDATORS}

DOCKER_FLAGS := --rm

${VALIDATORS}:
	docker build -t lucibus/api-$@ -f validators/$@.Dockerfile .

VALID := $(wildcard valid/*.state.json)
INVALID := $(wildcard invalid/*)

JOINER := ~

VALID_TESTS := $(foreach valid,$(VALID),$(foreach validator,$(VALIDATORS),$(valid)$(JOINER)$(validator)))
INVALID_TESTS := $(foreach invalid,$(INVALID),$(foreach validator,$(VALIDATORS),$(invalid)$(JOINER)$(validator)))

${VALID_TESTS}:
	cat $(firstword $(subst $(JOINER), ,$@)) | docker run ${DOCKER_FLAGS} -i lucibus/api-$(lastword $(subst $(JOINER), ,$@))

${INVALID_TESTS}:
	cat $(firstword $(subst $(JOINER), ,$@)) | docker run ${DOCKER_FLAGS} -i lucibus/api-$(lastword $(subst $(JOINER), ,$@)); test $$? != 0


valid: ${VALID_TESTS}
invalid: ${INVALID_TESTS}

test: valid invalid

.PHONY: build ${VALIDATORS} ${VALID_TESTS} ${INVALID_TESTS} valid invalid test
