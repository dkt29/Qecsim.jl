"""
Abstract types and methods for codes, error models and decoders.
"""
module Model

using LinearAlgebra: I
using Qecsim: QecsimError
using Qecsim.PauliTools: bsp

export AbstractModel
export label

export StabilizerCode
export stabilizers, logical_xs, logical_zs, logicals, nkd, validate

export ErrorModel
export generate, probability_distribution

export Decoder
export DecodeResult
export decode

# AbstractModel

"""
Abstract supertype for models.
"""
abstract type AbstractModel end

"""
    label(code::AbstractModel) -> String

Return a label suitable for use in plots and for grouping results.

!!! note "Abstract method"

    This method should be implemented for concrete subtypes of [`AbstractModel`](@ref).
"""
function label end


# StabilizerCode

"""
    StabilizerCode <: AbstractModel

Abstract supertype for stabilizer codes.
"""
abstract type StabilizerCode <: AbstractModel end

"""
    stabilizers(code::StabilizerCode) -> BitMatrix

Return the stabilizers in binary symplectic form.

Each row is a stabilizer generator. An overcomplete set of generators can be included to
simplify decoding.

!!! note "Abstract method"

    This method should be implemented for concrete subtypes of [`StabilizerCode`](@ref).
"""
function stabilizers end

"""
    logical_xs(code::StabilizerCode) -> BitMatrix

Return the logical X operators in binary symplectic form.

Each row is an operator. The order should match that of [`logical_zs`](@ref).

!!! note "Abstract method"

    This method should be implemented for concrete subtypes of [`StabilizerCode`](@ref).
"""
function logical_xs end

"""
    logical_zs(code::StabilizerCode) -> BitMatrix

Return the logical Z operators in binary symplectic form.

Each row is an operator. The order should match that of [`logical_xs`](@ref).

!!! note "Abstract method"

    This method should be implemented for concrete subtypes of [`StabilizerCode`](@ref).
"""
function logical_zs end

"""
    logicals(code::StabilizerCode) -> BitMatrix

Return the logical operators in binary symplectic form.

Each row is an operator. X operators are stacked above Z operators in the order given by
[`logical_xs`](@ref) and [`logical_zs`](@ref).
"""
function logicals(code::StabilizerCode)
    return vcat(logical_xs(code), logical_zs(code))
end

"""
    nkd(code::StabilizerCode) -> Tuple{Int, Int, Union{Int, Missing}}

Return a descriptor in the format `(n, k, d)`, where `n` is the number of physical qubits,
`k` is the number of logical qubits, and `d` is the distance of the code (or `missing` if
unknown).

!!! note "Abstract method"

    This method should be implemented for concrete subtypes of [`StabilizerCode`](@ref).
"""
function nkd end

@doc raw"""
    validate(code::StabilizerCode)

Perform sanity checks.

If any of the following fail then a [`QecsimError`](@ref) is thrown:

* ``S \odot S^T = 0``
* ``S \odot L^T = 0``
* ``L \odot L^T = \Lambda``

where ``S`` and ``L`` are the code [`stabilizers`](@ref) and [`logicals`](@ref),
respectively, and ``\odot`` and ``\Lambda`` are defined in [`bsp`](@ref).
"""
function validate(code::StabilizerCode)
    s, l = stabilizers(code), logicals(code)
    !any(bsp(s, transpose(s))) || throw(QecsimError("stabilizers do not mutually commute"))
    !any(bsp(s, transpose(l))) || throw(QecsimError(
        "stabilizers do not commute with logicals"))
    # twisted identity with same size as logicals
    nlogicals = size(l, 1)
    twistedI = circshift(Matrix(I, nlogicals, nlogicals), nlogicals / 2)
    (bsp(l, transpose(l)) == twistedI) || throw(QecsimError(
        "logicals do not mutually twist commute"))
    return nothing
end


# ErrorModel

"""
    ErrorModel <: AbstractModel

Abstract supertype for error models.
"""
abstract type ErrorModel <: AbstractModel end

"""
    generate(error_model::ErrorModel, code::StabilizerCode, p::Float64,
             [rng::AbstractRNG=GLOBAL_RNG]) -> BitVector

Generate a new error in binary symplectic form according to the `error_model` and `code`,
where `p` is typically the probability of an error on a single qubit.

!!! note "Abstract method"

    This method should be implemented for concrete subtypes of [`ErrorModel`](@ref).
"""
function generate end

"""
    probability_distribution(error_model::ErrorModel, p::Float64) -> NTuple{4, Real}

Return the single-qubit probability distribution amongst Pauli I, X, Y and Z, where `p` is
the overall probability of an error on a single qubit.

!!! note "Abstract method [optional]"

    This method is **not** invoked by any core modules. Since it is often useful for
    decoders, it is provided as a template and concrete subtypes of [`ErrorModel`](@ref) are
    encouraged to implement it when appropriate, particularly for IID error models.
"""
function probability_distribution end


# Decoder
"""
    Decoder <: AbstractModel

Abstract supertype for decoders.
"""
abstract type Decoder <: AbstractModel end

"""
    decode(decoder::Decoder, code::StabilizerCode, syndrome::AbstractVector{Bool};
           kwargs...) -> DecodeResult

Resolve a recovery operation for the given `code` and `syndrome`, or evaluate the success of
decoding, as encapsulated in the decode result.

The syndrome has length equal to the number of code stabilizers, and element values of 0
or 1 (false or true) indicate whether the corresponding stabilizer does or does not commute
with the error, respectively.

Keyword parameters `kwargs` may be provided by the client with context values such as
`error_model`, `error_probability` and `error`. Most implementations will ignore such
parameters; however, if they are used, implementations should declare them explicitly and
treat them as optional.

!!! note "Abstract method"

    This method should be implemented for concrete subtypes of [`Decoder`](@ref).
"""
function decode end

"""
    DecodeResult(recovery::AbstractVector{Bool})

Construct a decoding result including the recovery operation.

!!! warning

    In the future, this type will be extended to include success flags and more.
"""
struct DecodeResult
    recovery::BitVector
end

end