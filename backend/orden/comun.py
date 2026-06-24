from enum import Enum

#crea un enumerador con los estados posibles
class OrdenStatus(Enum):
    CREATED = 'CREATED'
    PAYED = 'PAYED'
    COMPLETED = 'COMPLETED'
    CANCELED = 'CANCELED'
    
#crea lista con tuplas con los estados, ejm: (<OrdenStatus.CREATED: 'CREATED'>, 'CREATED')
choices = [(tag, tag.value) for tag in OrdenStatus]