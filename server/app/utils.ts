import { Producer } from 'mediasoup/node/lib/Producer';

export function producerModel(producer: Producer) {
    return {
        id: producer.id,
        peerId: producer.appData.peerId,
        kind: producer.kind,
        mediaTag: producer.appData.mediaTag,
        paused: producer.paused,
        recordStatus: 'stop',
    }
}