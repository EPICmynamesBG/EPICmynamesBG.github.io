var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            controller: 'MainPageController',
            templateUrl: './frontend/html/main.html',
            css: './frontend/styles/views/mainPage.css'
        })
        .when('/pokedex', {
            controller: 'PokedexController',
            templateUrl: './frontend/html/pokedex.html',
            css: './frontend/styles/views/pokedex.css'
        })
        .when('/pokedex/:id', {
            controller: 'PokemonController',
            templateUrl: './frontend/html/singleItemViews/pokemon.html',
            css: './frontend/styles/views/pokemon/pokemon.css'
        })
        .when('/trainers', {
            controller: 'TrainersController',
            templateUrl: './frontend/html/trainers.html',
            css: './frontend/styles/views/trainers.css'
        })
        .when('/trainer/:name', {
            controller: 'TrainerController',
            templateUrl: './frontend/html/singleItemViews/trainer.html',
            css: './frontend/styles/views/trainer/trainer.css'
        })
        .when('/gyms', {
            controller: 'GymsController',
            templateUrl: './frontend/html/gyms.html',
            css: './frontend/styles/views/gyms.css'
        })
        .when('/gym/:name', {
            controller: 'GymController',
            templateUrl: './frontend/html/singleItemViews/gym.html',
            css: './frontend/styles/views/gym/gym.css'
        })
        .when('/badges', {
            controller: 'BadgesController',
            templateUrl: './frontend/html/badges.html',
            css: './frontend/styles/views/badges.css'
        })
        .when('/search/:text', {
            controller: 'SearchResultsController',
            templateUrl: './frontend/html/searchResults.html',
            css: './frontend/styles/views/searchResults.css'
        })
        .otherwise({
            redirectTo: '/'
        });
});