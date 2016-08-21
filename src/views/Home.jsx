import React, { Component } from 'react'
import { Layout, Content, Grid, Cell } from 'react-mdl'
import { ReactMaterialSelect } from 'react-material-select'
import 'components/cube.js'

class Home extends Component {
    constructor() {
        super()

        this.state = {
            selected: {},
        }

        this.callbackFunction = this.callbackFunction.bind(this)
    }

    callbackFunction(selected) {
        this.setState({selected: selected})
    }

    render() {
        return (
            <Layout>
               <Content>
                    <Grid>
                        <Cell col={12} id="cubeAnimation"></Cell>
                        <Cell col={12}>
                            <ReactMaterialSelect label="Choose social media" resetLabel={false} onChange={this.callbackFunction.bind(this)}>
                                <option dataValue="linkedin">Linkedin</option>
                                <option dataValue="codepen">Codepen</option>
                                <option dataValue="github">Github</option>
                                <option dataValue="bitnoise">Bitnoise</option>
                                <option dataValue="brandedme">Brandedme</option>
                                <option dataValue="twitter">Twitter</option>
                            </ReactMaterialSelect>
                        </Cell>
                    </Grid>
               </Content>
           </Layout>
        )
    }
}

export default Home
