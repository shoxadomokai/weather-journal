# Weather-Journal App Project

## Overview

A node.js project built using the fetch API to create an asynchronous web app that uses Web API and user data to dynamically update the UI.

It receives the user's name, location and feeling to create a mood board at the given moment.

## Instructions

Nothing fancy here in terms of installation simply clone the repo or make a fork and work your magic.

Not sure how to clone a repo? Check out this link from GitHub explaining how.

### User Input

The app takes the user's location, name and current mode to populate the moodboard.

The moodboard is inititally give a class of hidden to prevent user scrolling. The class is revealed when the content required to populate it has been generated.

### Background

The background of the moodboard is retrieved through the unsplash API with the user's entered location as the search parameter. The first image is retrieved and set as the background.
