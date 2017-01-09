import React from 'react';
import Relay from 'react-relay';
import addImageMutation from './addImageMutation';
const Dropzone = require('react-dropzone');

class App extends React.Component {

    static contextTypes = {
      relay: Relay.PropTypes.Environment,
    }

    constructor( props, context ) {

      super( props, context )

      this.state = {
        count: 0,
      }
    }

_handle_OnChange = ( event ) => {
    //this.setState({count: this.state.count + 1});
    console.log(this.props.viewer.images.edges.length);
    this.context.relay.commitUpdate(
        new addImageMutation( {
          name: `blah`, // ${this.state.count}`,
          Viewer: this.props.viewer
        } )
      )
    this.setState({count: this.props.viewer.images.edges.length });
 }


  _onDrop = (files) => {
      console.log("Total Files uploaded", files.length, "Files:", files);
      let onSuccess = () => {
          console.log('Mutation successful!');
        };
      let onFailure = (transaction) => {
          console.log('Mutation failed!', transaction);
      };
      files.forEach((file)=> {
        this.context.relay.commitUpdate(
          new addImageMutation({
            file: file,
            Viewer: this.props.viewer,
          }),
          {onSuccess, onFailure}
        );
      });

  }

  render() {
    return (
      <div>
        <h1>list (Total: {this.state.count})</h1>
        <ul>
          {this.props.viewer.images.edges.map((edge, i) =>
            <li key={i}>{edge.node.name} (ID: {i})</li>
          )}
        </ul>
        <Dropzone onDrop={this._onDrop}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        images(first: 100) {
          edges {
            node {
              name,
            },
          },
        },
        ${addImageMutation.getFragment('Viewer')},
      }
    `,
  },
});
