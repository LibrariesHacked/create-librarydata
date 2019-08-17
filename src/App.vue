<template>
    <div id="app">
        <b-navbar>
        <template slot="brand">
            <b-navbar-item>
                <img
                    src="https://raw.githubusercontent.com/LibrariesHacked/librarieshacked.github.io/master/images/logo.png"
                    alt="Libraries Hacked Logo"
                >
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item href="#">
                Home
            </b-navbar-item>
            <b-navbar-item href="/schemas">
                Schemas
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-light">
                        Log in
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>

    </div>
</template>