/* @flow weak */

import Relay from 'react-relay'


export default class addImageMutation extends Relay.Mutation {
  static fragments = {
    Viewer: () => Relay.QL `
      fragment on User {
        id,
      }
    `,
  }
  getMutation() {
    return Relay.QL `mutation{ addImage }`
  }

  getFiles() {
    return {
      file: this.props.file,
    }
  }

  getVariables() {
    return {
      name: this.props.file.name,
    }
  }

  getFatQuery() {
    return Relay.QL `
      fragment on AddImagePayload {
        image,
        viewer {
            images
        },
      }
    `
  }
  getConfigs() {
    return [ {
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.Viewer.id,
      connectionName: 'ImageConnection',
      edgeName: 'ImageEdge',
      rangeBehaviors: {
          '': 'prepend',
      },
    } ]
  }

  getOptimisticResponse() {
    return {
      // FIXME: ToDo_TotalCount gets updated optimistically, but this edge does not
      // get added until the server responds
      Viewer: {
        id: this.props.Viewer.id,
      },
    }
  }
}
