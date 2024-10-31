import {InfoOutlineIcon} from '@sanity/icons'
import {Box, Text, Badge, Tooltip} from '@sanity/ui'
import type {BadgeTone} from '@sanity/ui'

type StatusTones = {
  EXISTS: BadgeTone
  OVERWRITE: BadgeTone
  UPDATE: BadgeTone
  CREATE: BadgeTone
  UNPUBLISHED: BadgeTone
}

const documentTones: StatusTones = {
  EXISTS: `primary`,
  OVERWRITE: `critical`,
  UPDATE: `caution`,
  CREATE: `positive`,
  UNPUBLISHED: `caution`,
}

const assetTones: StatusTones = {
  EXISTS: `critical`,
  OVERWRITE: `critical`,
  UPDATE: `critical`,
  CREATE: `positive`,
  UNPUBLISHED: `default`,
}

export type MessageTypes = {
  EXISTS: string
  OVERWRITE: string
  UPDATE: string
  CREATE: string
  UNPUBLISHED: string
}

const documentMessages: MessageTypes = {
  // Only happens once document is copied the first time, and _updatedAt is the same
  EXISTS: `This document already exists at the Destination with the same ID with the same Updated time.`,
  // Is true immediately after transaction as _updatedAt is updated by API after mutation
  // Is also true if the document at the destination has been manually modified
  // Presently, the plugin doesn't actually compare the two documents
  OVERWRITE: `A newer version of this document exists at the Destination, and it will be overwritten with this version.`,
  // Document at destination is older
  UPDATE: `An older version of this document exists at the Destination, and it will be overwritten with this version.`,
  // Document at destination doesn't exist
  CREATE: `This document will be created at the destination.`,
  UNPUBLISHED: `A Draft version of this Document exists in this Dataset, but only the Published version will be duplicated to the destination.`,
}

const assetMessages: MessageTypes = {
  EXISTS: `This Asset already exists at the Destination`,
  OVERWRITE: `This Asset already exists at the Destination`,
  UPDATE: `This Asset already exists at the Destination`,
  CREATE: `This Asset does not yet exist at the Destination`,
  UNPUBLISHED: ``,
}

const assetStatus: MessageTypes = {
  EXISTS: `RE-UPLOAD`,
  OVERWRITE: `RE-UPLOAD`,
  UPDATE: `RE-UPLOAD`,
  CREATE: `UPLOAD`,
  UNPUBLISHED: ``,
}

type StatusBadgeProps = {
  isAsset: boolean
  status?: keyof MessageTypes
}

export default function StatusBadge(props: StatusBadgeProps) {
  const {status, isAsset} = props

  if (!status) {
    return null
  }

  const badgeTone = isAsset ? assetTones[status] : documentTones[status]

  if (!badgeTone) {
    return (
      <Badge muted padding={2} fontSize={1} mode="outline">
        Checking...
      </Badge>
    )
  }

  const badgeText = isAsset ? assetMessages[status] : documentMessages[status]
  const badgeStatus = isAsset ? assetStatus[status] : status

  return (
    <Tooltip
      content={
        <Box padding={3} style={{maxWidth: 200}}>
          <Text size={1}>{badgeText}</Text>
        </Box>
      }
      fallbackPlacements={['right', 'left']}
      placement="top"
      portal
    >
      <Badge muted padding={3} fontSize={1} tone={badgeTone} mode="outline">
        {badgeStatus}
        <Box marginLeft={2} display={'inline-block'} as="span">
          <InfoOutlineIcon />
        </Box>
      </Badge>
    </Tooltip>
  )
}
