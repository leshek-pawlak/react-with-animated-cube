/* eslint no-undef: */

import React, { Component } from 'react'
import { Layout, Content, Grid, Cell } from 'react-mdl'
import ReactMaterialSelect from 'react-material-select'

import 'components/cube'
import setTargetRotation from 'components/cube'

class Home extends Component {
    constructor() {
        super()

        this.targetRotationPerSelect = {
            linkedin: {x: -0.019999999999999907, y: 0.12},
            codepen: {x: 12.559999999999999, y: -4.619999999999999},
            github: {x: 6.279999999999999, y: -1.46},
            itenteges: {x: -1.58, y: 0.14},
            instagram: {x: 1.56, y: 0.09999999999999999},
            facebook: {x: 3.12, y: 0.08000000000000002},
        }

        this.callbackFunction = this.callbackFunction.bind(this)
    }

    callbackFunction(selected) {
        // change cube site on select
        setTargetRotation(this.targetRotationPerSelect[selected.value])
    }

    render() {
        return (
            <Layout>
               <Content>
                    <Grid>
                        <Cell col={12}></Cell>
                        <Cell col={12} id="reactMaterialSelect">
                            <ReactMaterialSelect label="Choose social media" resetLabel={false} onChange={this.callbackFunction.bind(this)}>
                                <option dataValue="linkedin">Linkedin</option>
                                <option dataValue="codepen">Codepen</option>
                                <option dataValue="github">Github</option>
                                <option dataValue="itenteges">IT&Teges</option>
                                <option dataValue="instagram">Instagram</option>
                                <option dataValue="facebook">Facebook</option>
                            </ReactMaterialSelect>
                        </Cell>
                    </Grid>
               </Content>
           </Layout>
        )
    }
}

export default Home
