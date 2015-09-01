import React, {Component} from 'react'
import {assign} from 'lodash'

import {cerebralPropTypes, Cerebral} from 'common/utils'
import Add from 'common/components/Add'
import Remove from 'common/components/Remove'
import Address from './Address'
import Tags from './Tags'

@Cerebral({
  patch: ['synced', 'patch'],
  newPatchItem: ['local', 'newPatchItem'],
  newPatchItemValid: ['local', '$newPatchItemValid']
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
            <tr>
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
              return (
                <tr>

                  <td>
                    <Address
                      address={address}
                      onChange={address => this.props.signals.changedPatchItemAddress(true, {oldAddress: address, newAddress: address})}
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

Patch.propTypes = assign(
  {},
  {
    patch: React.PropTypes.object.isRequired,
    newPatchItem: React.PropTypes.object.isRequired,
    newPatchItemValid: React.PropTypes.bool.isRequired
  },
  cerebralPropTypes
)

export default Patch
