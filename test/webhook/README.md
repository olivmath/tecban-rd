## Run-up Events mock

### How to Work?

1. Run Besu: We need it to:

    - Deploy "Real Digital"
    - Transfer Tokens (Generate Events)
    - Listen to events

2. Deploy "Real Digital": We need it to:

    - Generate events

3. Run Listener: We need it to:

    - Listen to events and send them to our api

4. Run Auto-Transfer: We need it to:
    - Generate transactions that generate events
    - By default it makes 1 transfer every 10s

### How to Run?

1. [Run Besu](./besu/README.md)
2. [Deploy Token](./contracts/README.md)
3. [Run Listener](./listener/README.md)
4. [Run Auto-Transfer](./listener/README.md)
