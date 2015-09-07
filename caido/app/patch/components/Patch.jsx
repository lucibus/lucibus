/*eslint-disable react/prop-types */
import React, {Component} from 'react'

import {Cerebral} from 'common/utils'
import Add from 'common/components/Add'
import Remove from 'common/components/Remove'
import Address from './Address'
import Tags from './Tags'

export default @Cerebral({
  patch: ['synced', 'patch'],
  newPatchItem: ['local', 'newPatchItem'],
  newPatchItemValid: ['local', '$newPatchItemValid']
}, {
  patch: React.PropTypes.object.isRequired,
  newPatchItem: React.PropTypes.object.isRequired,
  newPatchItemValid: React.PropTypes.bool.isRequired
})
class Patch extends Component {

  render () {
    return (
      <div className='col-lg-12' id='patch'>
        <h2>Patch</h2>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>Address</th>
              <th>Tags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr key='new'>
              <td>
                <Address
                  address={this.props.newPatchItem.address}
                  onChange={address => this.props.signals.changedNewPatchItemAddress(true, {address})}
                />
              </td>
              <td>
                <Tags
                  tags={this.props.newPatchItem.tags}
                  onChange={tags => this.props.signals.changedNewPatchItemTags({tagsJSON: JSON.stringify(tags)})}
                />
              </td>
              <td>
                <Add
                  disabled={!this.props.newPatchItemValid}
                  onClick={this.props.signals.clickedAddNewPatchItem}
                />
              </td>
            </tr>

            {Object.keys(this.props.patch).map(address => {
              var tags = this.props.patch[address]
              address = parseInt(address, 10)
              return (
                <tr key={address}>

                  <td>
                    <Address
                      address={address}
                      onChange={newAddress => this.props.signals.changedPatchItemAddress(true, {oldAddress: address, newAddress: newAddress})}
                    />
                  </td>
                  <td>
                    <Tags
                      tags={tags}
                      onChange={tags => this.props.signals.changedPatchItemTags({tagsJSON: JSON.stringify(tags), address})}
                    />
                  </td>
                  <td>
                    <Remove
                      onClick={() => this.props.signals.clickedRemovePatchItem({address})}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
