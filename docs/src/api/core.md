# Core

## Qecsim
```@docs
Qecsim
Qecsim.QecsimError
```

## App
```@meta
CurrentModule = Qecsim.App
```
```@docs
App
App.qec_run_once
```

## Model
```@meta
CurrentModule = Qecsim.Model
```
```@docs
Model
```
### Model.AbstractModel
```@docs
Model.AbstractModel
Model.label
```
### Model.StabilizerCode
```@docs
Model.StabilizerCode
Model.logical_xs
Model.logical_zs
Model.logicals
Model.nkd
Model.stabilizers
Model.validate
```
### Model.ErrorModel
```@docs
Model.ErrorModel
Model.generate
Model.probability_distribution
```
### Model.Decoder
```@docs
Model.Decoder
Model.DecodeResult
Model.decode
```

## PauliTools
```@meta
CurrentModule = Qecsim.PauliTools
```
```@docs
PauliTools
PauliTools.bsp
PauliTools.pack
PauliTools.to_bsf
PauliTools.to_pauli
PauliTools.unpack
PauliTools.weight
```