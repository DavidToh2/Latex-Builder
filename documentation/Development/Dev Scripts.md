# Introduction

This file documents some of the scripts used to streamline deployment. All scripts are written in bash and run using the Makefile at root.

- [Introduction](#introduction)
- [Makefile](#makefile)
  - [Tangent: how C and the Makefile work](#tangent-how-c-and-the-makefile-work)
- [Documentation Copying and Formatting](#documentation-copying-and-formatting)

# Makefile

CMake by default is a tool used to automate the compilation and build process of C/C++ projects. Makefiles are files containing **rules** for compiling source files into object files, and linking them into binary executables.

We're not using the Makefile for that purpose here; rather we just want its ability to run commands.

A script is defined as follows:

```make
script-name:
    ( \
    echo "Hello there!" && \ 
    cd ../ )
```

Because these are not actual C++ compilation instructions (more precisely, because script-name is not the name of an object file), they are "phony" and we have to indicate as such:

```make
.PHONY: script-name
```

## Tangent: how C and the Makefile work

Creating an executable file from source code in C works in a few steps:

1. Pre-processing: the C++ pre-processor `cpp` includes all headers and expands all macros in the source code file, to produce an *expanded source code file*.
2. Compilation: the C++ compiler `gcc` converts the *expanded source code* into assembly code.
   - At this point, all variable names, function names, classes etc. are converted to *symbols* and stored in a *symbol table*.
   - Some symbols are *declared but not defined*.
3. Assembly: the assembler (`as.exe`) converts the assembly code into machine code, which is now called an *object file*. 
4. Linking: the linker `ld` combines all object files into an executable (or a shared library).
   - The linker will replace all undefined symbols with the correct references.
   - For this to happen, the symbol must be defined in another file or library, which must be provided to the linker.

Make is a tool that streamlines compilation and linking via the following, simple optimisation:
- Do not redo the compilation stage for an object file, if its code has not changed 
- i.e. if the last modified time for its codefile, and all of its dependencies, is earlier than that of the object file. (We call this **recency**)

Every Makefile **rule** has as its name a **target file**, a list of **dependency files**, and a **build recipe**:

```make
target-file: dep1 dep2 dep3 dep4
    recipe
```

When a rule is targeted, `make` checks all dependencies for recency, runs the make-rules for those dependencies that do not satisfy recency (to update them), before running the make-rule for that target.

[Tutorial](https://web.mit.edu/gnu/doc/html/make_2.html)

# Documentation Copying and Formatting

Documentation files are stored in `documentation` and should be moved to `vue-frontend/docs`