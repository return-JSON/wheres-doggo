import * as React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { fetchCollectedDogs } from '../src/reducers/user'

class Dogs extends React.Component {
    constructor (props) {
        super (props)
    }
    componentDidMount() {
        // console.log('this.props in Dogs', this.props);
        const { user } = this.props
        // console.log('user.id', user.user.id);
        // this.props.fetchCollectedDogs(user.user.id)
    }
    render() {
        return (
            <Text>Hello</Text>
        )
    }
}

const mapState = state => {
    return {
        user: state.user
    }
}

const mapDispatch = dispatch => ({
   fetchCollectedDogs: userId => dispatch(fetchCollectedDogs(userId))
});

export default connect(mapState, mapDispatch)(Dogs)