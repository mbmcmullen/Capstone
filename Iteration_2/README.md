# Iteration 2

### Sources:

+ [Configuring initial Docker settings](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

### Docker setup commands:

+ docker build -t iteration_2 .
+ run container
    - docker run -p 49160:8080 -d iteration_2
    - docker run -it iteration_2 /bin/bash

### Fault Tolerance Ideas

    [x] Send default value after error occurs 
    [ ] Tag a value as a valid or default/error value
    [ ] Send every publish event as tuple of (timestamp, value) 
    [ ] Create qaulity of Service Parameter that specifies number of times an Observer (KPI node) will accept a default value
    [ ] Publish back to message broker telling client to restart 
     