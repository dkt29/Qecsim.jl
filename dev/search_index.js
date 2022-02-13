var documenterSearchIndex = {"docs":
[{"location":"api/core/#Core","page":"Core","title":"Core","text":"","category":"section"},{"location":"api/core/#Qecsim","page":"Core","title":"Qecsim","text":"","category":"section"},{"location":"api/core/","page":"Core","title":"Core","text":"Qecsim\nQecsim.QecsimError","category":"page"},{"location":"api/core/#Qecsim","page":"Core","title":"Qecsim","text":"Package for simulating quantum error correction using stabilizer codes.\n\n\n\n\n\n","category":"module"},{"location":"api/core/#Qecsim.QecsimError","page":"Core","title":"Qecsim.QecsimError","text":"QecsimError <: Exception\n\nQecsimError(msg)\n\nConstruct an exception indicating an internal (core or models) error.\n\n\n\n\n\n","category":"type"},{"location":"api/core/#App","page":"Core","title":"App","text":"","category":"section"},{"location":"api/core/","page":"Core","title":"Core","text":"App\nApp.qec_run_once\nApp.RunResult\nApp.qec_run\nApp.qec_merge\nApp.qec_read\nApp.qec_write","category":"page"},{"location":"api/core/#Qecsim.App","page":"Core","title":"Qecsim.App","text":"Functions to run quantum error correction simulations and merge/read/write output data.\n\n\n\n\n\n","category":"module"},{"location":"api/core/#Qecsim.App.qec_run_once","page":"Core","title":"Qecsim.App.qec_run_once","text":"qec_run_once(\n    code, error_model, decoder, p::Real, rng::AbstractRNG=GLOBAL_RNG\n) -> RunResult\n\nExecute a stabilizer code error-decode-recovery (ideal) simulation and return run result.\n\nThe parameters code, error_model and decoder should be concrete subtypes or duck-typed implementations of StabilizerCode, ErrorModel and Decoder, respectively.\n\nThe simulation algorithm is as follows:\n\nS  stabilizers(code)\nL  logicals(code)\ne  generate(error_model, code, p, rng)\ny  S  e\ndecode_result  decode(decoder, code, y; kwargs...)\nr  decode_result.recovery\nsanity check: S  (r  e) = 0\nlogical_commutations  L  (r  e)\nsuccess  L  (r  e) = 0\n\nwhere  denotes element-wise exclusive-or, and  is defined in PauliTools.bsp.\n\nThe kwargs passed to decode include error_model, p and error; most decoders will ignore these parameters. The decode method returns a DecodeResult. If decode_result.success and/or decode_result.logical_commutations are specified, they override the values of success and logical_commutations, irrespective of whether decode_result.recovery is specified or not. The value decode_result.custom_values is passed through in the run result.\n\nSee also RunResult.\n\nExamples\n\njulia> using Qecsim.BasicModels, Qecsim.GenericModels, Random\n\njulia> rng = MersenneTwister(6);  # use random seed for reproducible result\n\njulia> qec_run_once(FiveQubitCode(), DepolarizingErrorModel(), NaiveDecoder(), 0.2, rng)\nRunResult{Nothing}(false, 2, Bool[1, 0], nothing)\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.App.RunResult","page":"Core","title":"Qecsim.App.RunResult","text":"RunResult(\n    success::Bool,\n    error_weight::Int,\n    logical_commutations::Union{Nothing,BitVector}\n    custom_values::Union{Nothing,Vector}\n)\n\nConstruct a run result as returned by qec_run_once.\n\nExamples\n\njulia> r = RunResult(false, 2, BitVector([0, 1]), [1.2, 3.1])\nRunResult{Vector{Float64}}(false, 2, Bool[0, 1], [1.2, 3.1])\n\njulia> r.success, r.error_weight, r.logical_commutations, r.custom_values\n(false, 2, Bool[0, 1], [1.2, 3.1])\n\n\n\n\n\n","category":"type"},{"location":"api/core/#Qecsim.App.qec_run","page":"Core","title":"Qecsim.App.qec_run","text":"qec_run(\n    code, error_model, decoder, p::Real, random_seed=nothing;\n    max_runs::Union{Integer,Nothing}=nothing,\n    max_failures::Union{Integer,Nothing}=nothing\n) -> Dict\n\nExecute stabilizer code error-decode-recovery (ideal) simulations many times and return aggregated run data, see qec_run_once for details of a single run.\n\nThe parameters code, error_model and decoder should be concrete subtypes or duck-typed implementations of StabilizerCode, ErrorModel and Decoder, respectively.\n\nSimulations are run one or more times as determined by max_runs and max_failures. If max_runs and/or max_failures are specified, stop after max_runs runs or max_failures failures, whichever happens first. If neither is specified, stop after one run.\n\nThe returned aggregated data has the following format:\n\nDict(\n    :code => \"5-qubit\"              # label(code)\n    :n_k_d => (5, 1, 3)             # nkd(code)\n    :time_steps => 1                # always 1 for ideal simulations\n    :error_model => \"Depolarizing\"  # label(error_model)\n    :decoder => \"Naive\"             # label(decoder)\n    :error_probability => 0.1       # p\n    :measurement_error_probability => 0.0   # always 0.0 for ideal simulations\n    :n_run => 100                   # count of runs\n    :n_success => 92                # count of successful recoveries\n    :n_fail => 8                    # count of failed recoveries\n    :n_logical_commutations => [5, 6]   # count of logical_commutations\n    :custom_totals => nothing       # sum of custom_values\n    :error_weight_total => 55       # sum of error_weight over n_run runs\n    :error_weight_pvar => 0.4075    # pvariance of error_weight over n_run runs\n    :logical_failure_rate => 0.08   # n_fail / n_run\n    :physical_error_rate => 0.11    # error_weight_total / n_k_d[1] / time_steps / n_run\n    :wall_time => 0.00253906        # wall-time for run in fractional seconds\n)\n\nExamples\n\njulia> using Qecsim.BasicModels, Qecsim.GenericModels\n\njulia> seed = 7;\n\njulia> data = qec_run(FiveQubitCode(), DepolarizingErrorModel(), NaiveDecoder(), 0.1, seed;\n           max_runs=100);\n┌ Info: qec_run: starting\n│   code = Qecsim.BasicModels.BasicCode([\"XZZXI\", \"IXZZX\", \"XIXZZ\", \"ZXIXZ\"], [\"XXXXX\"], [\"ZZZZZ\"], (5, 1, 3), \"5-qubit\")\n│   error_model = Qecsim.GenericModels.DepolarizingErrorModel()\n│   decoder = Qecsim.GenericModels.NaiveDecoder(10)\n│   p = 0.1\n│   random_seed = 7\n│   max_runs = 100\n└   max_failures = nothing\n[ Info: qec_run: rng=Random.MersenneTwister(7)\n[ Info: qec_run: complete: data=Dict{Symbol, Any}(:error_weight_pvar => 0.4075000000000001, :time_steps => 1, :n_logical_commutations => [5, 6], :error_weight_total => 55, :wall_time => 0.002539058, :n_k_d => (5, 1, 3), :error_model => \"Depolarizing\", :physical_error_rate => 0.11, :measurement_error_probability => 0.0, :error_probability => 0.1, :n_success => 92, :logical_failure_rate => 0.08, :custom_totals => nothing, :code => \"5-qubit\", :decoder => \"Naive\", :n_fail => 8, :n_run => 100)\n\njulia> data\nDict{Symbol, Any} with 17 entries:\n  :error_weight_pvar             => 0.4075\n  :time_steps                    => 1\n  :n_logical_commutations        => [5, 6]\n  :error_weight_total            => 55\n  :wall_time                     => 0.00253906\n  :n_k_d                         => (5, 1, 3)\n  :error_model                   => \"Depolarizing\"\n  :physical_error_rate           => 0.11\n  :measurement_error_probability => 0.0\n  :error_probability             => 0.1\n  :n_success                     => 92\n  :logical_failure_rate          => 0.08\n  :custom_totals                 => nothing\n  :code                          => \"5-qubit\"\n  :decoder                       => \"Naive\"\n  :n_fail                        => 8\n  :n_run                         => 100\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.App.qec_merge","page":"Core","title":"Qecsim.App.qec_merge","text":"qec_merge(data...) -> Vector{Dict}\n\nMerge simulation run data.\n\nRun data is expected in the format specified by qec_run. Merged data is grouped by: (:code, :n_k_d, :error_model, :decoder, :error_probability, :time_steps, :measurement_error_probability). The scalar values: :n_run, :n_success, :n_fail, :error_weight_total and :wall_time are summed. The vector value: :n_logical_commutations is summed element-wise. The vector value: :custom_totals is summed element-wise for scalar elements and concatenated along dimension 1 (vcat) for array elements. The values: :logical_failure_rate and :physical_error_rate are recalculated. The value :error_weight_pvar is not currently recalculated and is therefore omitted.\n\nExamples\n\njulia> using Qecsim.BasicModels, Qecsim.GenericModels, Logging\n\njulia> code, error_model, decoder = FiveQubitCode(), BitFlipErrorModel(), NaiveDecoder();\n\njulia> data = Dict[];\n\njulia> with_logger(NullLogger()) do # disable logging for brevity in doctest\n           push!(data, qec_run(code, error_model, decoder, 0.08, 19; max_runs=100))\n           push!(data, qec_run(code, error_model, decoder, 0.08, 23; max_runs=100))\n       end;\n\njulia> qec_merge(data...)\n1-element Vector{Dict{Symbol, Any}}:\n Dict(:measurement_error_probability => 0.0, :error_probability => 0.08, :time_steps => 1, :error_weight_total => 83, :n_logical_commutations => [11, 3], :wall_time => 0.0028351720000000004, :n_k_d => (5, 1, 3), :error_model => \"Bit-flip\", :n_success => 189, :logical_failure_rate => 0.055…)\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.App.qec_read","page":"Core","title":"Qecsim.App.qec_read","text":"qec_read(io::IO) -> Vector{Dict{Symbol,Any}}\nqec_read(filename::AbstractString) -> Vector{Dict{Symbol,Any}}\n\nRead simulation run data from the given I/O stream or file.\n\nRun data is expected in the format written by qec_write (i.e. a JSON array of objects using default JSON encoding of the format specified by qec_run). The read data is converted to the specified return type as follows: dictionary keys are converted to symbols, :n_k_d entries are converted to tuples, and vector types are inferred from their elements. If this conversion fails, an exception is thrown.\n\nThe JSON format is compatible with the format used by the Python package qecsim.\n\nSee also qec_write.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.App.qec_write","page":"Core","title":"Qecsim.App.qec_write","text":"qec_write(io::IO, data...)\nqec_write(filename::AbstractString, data...)\n\nWrite simulation run data to the given I/O stream or file.\n\nRun data is expected in the format specified by qec_run and written as a JSON array of objects using default JSON encoding. No checking of the format of the given data is performed. The file version of this method will refuse to overwrite an existing file, instead attempting to log the unwritten data and throwing an exception.\n\nThe JSON format is compatible with the format used by the Python package qecsim.\n\nSee also qec_read.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Model","page":"Core","title":"Model","text":"","category":"section"},{"location":"api/core/","page":"Core","title":"Core","text":"Model","category":"page"},{"location":"api/core/#Qecsim.Model","page":"Core","title":"Qecsim.Model","text":"Abstract types and methods for codes, error models and decoders.\n\n\n\n\n\n","category":"module"},{"location":"api/core/#Model.AbstractModel","page":"Core","title":"Model.AbstractModel","text":"","category":"section"},{"location":"api/core/","page":"Core","title":"Core","text":"Model.AbstractModel\nModel.label","category":"page"},{"location":"api/core/#Qecsim.Model.AbstractModel","page":"Core","title":"Qecsim.Model.AbstractModel","text":"Abstract supertype for models.\n\n\n\n\n\n","category":"type"},{"location":"api/core/#Qecsim.Model.label","page":"Core","title":"Qecsim.Model.label","text":"label(model) -> String\n\nReturn a label suitable for use in plots and for grouping results.\n\nnote: Abstract method\nThis method should be implemented for concrete subtypes or duck-typed implementations of AbstractModel.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Model.StabilizerCode","page":"Core","title":"Model.StabilizerCode","text":"","category":"section"},{"location":"api/core/","page":"Core","title":"Core","text":"Model.StabilizerCode\nModel.logical_xs\nModel.logical_zs\nModel.logicals\nModel.nkd\nModel.stabilizers\nModel.validate","category":"page"},{"location":"api/core/#Qecsim.Model.StabilizerCode","page":"Core","title":"Qecsim.Model.StabilizerCode","text":"StabilizerCode <: AbstractModel\n\nAbstract supertype for stabilizer codes.\n\n\n\n\n\n","category":"type"},{"location":"api/core/#Qecsim.Model.logical_xs","page":"Core","title":"Qecsim.Model.logical_xs","text":"logical_xs(code) -> BitMatrix\n\nReturn the logical X operators in binary symplectic form.\n\nEach row is an operator. The order should match that of logical_zs.\n\nnote: Abstract method\nThis method should be implemented for concrete subtypes or duck-typed implementations of StabilizerCode.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.Model.logical_zs","page":"Core","title":"Qecsim.Model.logical_zs","text":"logical_zs(code) -> BitMatrix\n\nReturn the logical Z operators in binary symplectic form.\n\nEach row is an operator. The order should match that of logical_xs.\n\nnote: Abstract method\nThis method should be implemented for concrete subtypes or duck-typed implementations of StabilizerCode.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.Model.logicals","page":"Core","title":"Qecsim.Model.logicals","text":"logicals(code) -> BitMatrix\n\nReturn the logical operators in binary symplectic form.\n\nEach row is an operator. X operators are stacked above Z operators in the order given by logical_xs and logical_zs.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.Model.nkd","page":"Core","title":"Qecsim.Model.nkd","text":"nkd(code) -> Tuple{Int,Int,Union{Int,Missing}}\n\nReturn a descriptor in the format (n, k, d), where n is the number of physical qubits, k is the number of logical qubits, and d is the distance of the code (or missing if unknown).\n\nnote: Abstract method\nThis method should be implemented for concrete subtypes or duck-typed implementations of StabilizerCode.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.Model.stabilizers","page":"Core","title":"Qecsim.Model.stabilizers","text":"stabilizers(code) -> BitMatrix\n\nReturn the stabilizers in binary symplectic form.\n\nEach row is a stabilizer generator. An overcomplete set of generators can be included to simplify decoding.\n\nnote: Abstract method\nThis method should be implemented for concrete subtypes or duck-typed implementations of StabilizerCode.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.Model.validate","page":"Core","title":"Qecsim.Model.validate","text":"validate(code)\n\nPerform sanity checks.\n\nIf any of the following fail then a QecsimError is thrown:\n\nS  S^T = 0\nS  L^T = 0\nL  L^T = Λ\n\nwhere S and L are the code stabilizers and logicals, respectively, and  and Λ are defined in PauliTools.bsp.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Model.ErrorModel","page":"Core","title":"Model.ErrorModel","text":"","category":"section"},{"location":"api/core/","page":"Core","title":"Core","text":"Model.ErrorModel\nModel.generate\nModel.probability_distribution","category":"page"},{"location":"api/core/#Qecsim.Model.ErrorModel","page":"Core","title":"Qecsim.Model.ErrorModel","text":"ErrorModel <: AbstractModel\n\nAbstract supertype for error models.\n\n\n\n\n\n","category":"type"},{"location":"api/core/#Qecsim.Model.generate","page":"Core","title":"Qecsim.Model.generate","text":"generate(error_model, code, p::Real, [rng::AbstractRNG=GLOBAL_RNG]) -> BitVector\n\nGenerate a new error in binary symplectic form according to the error_model and code, where p is typically the probability of an error on a single qubit.\n\nnote: Abstract method\nThis method should be implemented for concrete subtypes or duck-typed implementations of ErrorModel.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.Model.probability_distribution","page":"Core","title":"Qecsim.Model.probability_distribution","text":"probability_distribution(error_model, p::Real) -> NTuple{4,Real}\n\nReturn the single-qubit probability distribution amongst Pauli I, X, Y and Z, where p is the overall probability of an error on a single qubit.\n\nnote: Abstract method [optional]\nThis method is not invoked by any core modules. Since it is often useful for decoders, it is provided as a template and concrete subtypes or duck-typed implementations of ErrorModel are encouraged to implement it when appropriate, particularly for IID error models.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Model.Decoder","page":"Core","title":"Model.Decoder","text":"","category":"section"},{"location":"api/core/","page":"Core","title":"Core","text":"Model.Decoder\nModel.decode\nModel.DecodeResult","category":"page"},{"location":"api/core/#Qecsim.Model.Decoder","page":"Core","title":"Qecsim.Model.Decoder","text":"Decoder <: AbstractModel\n\nAbstract supertype for decoders.\n\n\n\n\n\n","category":"type"},{"location":"api/core/#Qecsim.Model.decode","page":"Core","title":"Qecsim.Model.decode","text":"decode(decoder, code, syndrome::AbstractVector{Bool}; kwargs...) -> DecodeResult\n\nResolve a recovery operation for the given code and syndrome, or evaluate the success of decoding, as encapsulated in the decode result.\n\nThe syndrome has length equal to the number of code stabilizers, and element values of 0 or 1 (false or true) indicate whether the corresponding stabilizer does or does not commute with the error, respectively.\n\nKeyword parameters kwargs may be provided by the client, e.g. App, with context values such as error_model, error_probability and error. Most implementations will ignore such parameters; however, if they are used, implementations should declare them explicitly and treat them as optional.\n\nSee also DecodeResult.\n\nnote: Abstract method\nThis method should be implemented for concrete subtypes or duck-typed implementations of Decoder.\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.Model.DecodeResult","page":"Core","title":"Qecsim.Model.DecodeResult","text":"DecodeResult(\n    success::Union{Nothing,Bool},\n    recovery::Union{Nothing,AbstractVector{Bool}},\n    logical_commutations::Union{Nothing,AbstractVector{Bool}}\n    custom_values::Union{Nothing,AbstractVector}\n)\nDecodeResult(;\n    success::Union{Nothing,Bool}=nothing,\n    recovery::Union{Nothing,AbstractVector{Bool}}=nothing,\n    logical_commutations::Union{Nothing,AbstractVector{Bool}}=nothing\n    custom_values::Union{Nothing,AbstractVector}=nothing\n)\n\nConstruct a decoding result as returned by decode.\n\nTypically decoders will provide a recovery operation and delegate the evaluation of success and logical_commutations to the client, e.g. App. Optionally, success and/or logical_commutations may be provided as overrides. At least one of recovery or success must be specified to allow a success value to be resolved. Additionally custom_values may be specified. If logical_commutations and/or custom_values are provided then they should be of consistent type and size over identically parameterized simulation runs. For example, App will sum logical_commutations across runs and, similarly, if custom_values are numbers they will be summed across runs, and if they are arrays they will be concatenated using vcat.\n\nSee also decode.\n\nExamples\n\njulia> DecodeResult(; recovery=BitVector([1, 0, 1, 0, 1, 1]))  # typical use-case\nDecodeResult{Nothing}(nothing, Bool[1, 0, 1, 0, 1, 1], nothing, nothing)\n\njulia> DecodeResult(; success=true)  # override success\nDecodeResult{Nothing}(true, nothing, nothing, nothing)\n\njulia> DecodeResult(; success=false, logical_commutations=BitVector([1, 0]))  # override all\nDecodeResult{Nothing}(false, nothing, Bool[1, 0], nothing)\n\njulia> DecodeResult(; success=true, custom_values=[2.3, 4.1])  # custom values (numbers)\nDecodeResult{Vector{Float64}}(true, nothing, nothing, [2.3, 4.1])\n\njulia> DecodeResult(; success=true, custom_values=[[2.3], [4.1]])  # custom values (arrays)\nDecodeResult{Vector{Vector{Float64}}}(true, nothing, nothing, [[2.3], [4.1]])\n\njulia> DecodeResult(true, nothing, nothing, [2.3, 4.1])  # positional parameters\nDecodeResult{Vector{Float64}}(true, nothing, nothing, [2.3, 4.1])\n\njulia> DecodeResult(; success=nothing, recovery=nothing)  # too few specified parameters\nERROR: QecsimError: at least one of 'success' or 'recovery' must be specified\nStacktrace:\n[...]\n\n\n\n\n\n","category":"type"},{"location":"api/core/#PauliTools","page":"Core","title":"PauliTools","text":"","category":"section"},{"location":"api/core/","page":"Core","title":"Core","text":"PauliTools\nPauliTools.bsp\nPauliTools.pack\nPauliTools.to_bsf\nPauliTools.to_pauli\nPauliTools.unpack\nPauliTools.weight","category":"page"},{"location":"api/core/#Qecsim.PauliTools","page":"Core","title":"Qecsim.PauliTools","text":"Tools for Pauli strings and binary symplectic vectors / matrices.\n\n\n\n\n\n","category":"module"},{"location":"api/core/#Qecsim.PauliTools.bsp","page":"Core","title":"Qecsim.PauliTools.bsp","text":"bsp(\n    A::AbstractVecOrMat{Bool}, B::AbstractVecOrMat{Bool}\n) -> Union{Bool,BitVector,BitMatrix}\n\nReturn the binary symplectic product of A with B, given in binary symplectic form.\n\nThe binary symplectic product  is defined as A  B  A Λ B bmod 2 where Λ = leftbeginsmallmatrix 0  I  I  0 endsmallmatrixright.\n\nExamples\n\njulia> a = BitVector([1, 0, 0, 0]);  # XI\n\njulia> b = BitVector([0, 0, 1, 0]);  # ZI\n\njulia> bsp(a', b)\ntrue\n\njulia> stabilizers = BitMatrix(  # 5-qubit stabilizers\n       [1 0 0 1 0 0 1 1 0 0     # XZZXI\n        0 1 0 0 1 0 0 1 1 0     # IXZZX\n        1 0 1 0 0 0 0 0 1 1     # XIXZZ\n        0 1 0 1 0 1 0 0 0 1]);  # ZXIXZ\n\njulia> error = BitVector([0, 0, 1, 1, 0, 0, 1, 0, 1, 0]);  # IZXYI\n\njulia> bsp(stabilizers, error)\n4-element BitVector:\n 0\n 1\n 1\n 0\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.PauliTools.pack","page":"Core","title":"Qecsim.PauliTools.pack","text":"pack(bsf::AbstractVector{Bool}) -> Tuple{String,Int}\n\nPack a binary vector into a concise representation, typically for log output. See also unpack.\n\nExamples\n\njulia> a = BitVector([1, 0, 1, 0, 1, 1]);  # XZY\n\njulia> b = pack(a)  # (hex_value, length)\n(\"2b\", 6)\njulia> unpack(b) == a\ntrue\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.PauliTools.to_bsf","page":"Core","title":"Qecsim.PauliTools.to_bsf","text":"to_bsf(\n    pauli::Union{AbstractString,AbstractVector{<:AbstractString}}\n) -> Union{BitVector,BitMatrix}\n\nConvert the Pauli string operator(s) to binary symplectic form.\n\nA single Pauli string is converted to a vector. A vector of Pauli strings is converted to a matrix where each row corresponds to a Pauli.\n\nExamples\n\njulia> to_bsf(\"XIZIY\")\n10-element BitVector:\n 1\n 0\n 0\n 0\n 1\n 0\n 0\n 1\n 0\n 1\n\njulia> to_bsf([\"XIZIY\", \"IXZYI\"])\n2×10 BitMatrix:\n 1  0  0  0  1  0  0  1  0  1\n 0  1  0  1  0  0  0  1  1  0\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.PauliTools.to_pauli","page":"Core","title":"Qecsim.PauliTools.to_pauli","text":"to_pauli(bsf::AbstractVecOrMat{Bool}) -> Union{String,Vector{String}}\n\nConvert the binary symplectic form to Pauli string operator(s).\n\nA vector is converted to a single Pauli string. A matrix is converted row-by-row to a collection of Pauli strings.\n\nExamples\n\njulia> to_pauli(BitVector([1, 0, 0, 0, 1, 0, 0, 1, 0, 1]))\n\"XIZIY\"\n\njulia> to_pauli(BitMatrix([1 0 0 0 1 0 0 1 0 1; 0 1 0 1 0 0 0 1 1 0]))\n2-element Vector{String}:\n \"XIZIY\"\n \"IXZYI\"\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.PauliTools.unpack","page":"Core","title":"Qecsim.PauliTools.unpack","text":"unpack(packed_bsf::Tuple{String,Int}) -> BitVector\n\nUnpack a binary vector from a concise representation, typically from log output. See also pack.\n\nExamples\n\njulia> a = (\"2b\", 6);  # (hex_value, length)\n\njulia> b = unpack(a)  # XZY\n6-element BitVector:\n 1\n 0\n 1\n 0\n 1\n 1\njulia> pack(b) == a\ntrue\n\n\n\n\n\n","category":"function"},{"location":"api/core/#Qecsim.PauliTools.weight","page":"Core","title":"Qecsim.PauliTools.weight","text":"weight(bsf::AbstractVecOrMat{Bool}) -> Int\n\nReturn the weight of the binary symplectic form.\n\nExamples\n\njulia> weight(BitVector([1, 0, 0, 0, 1, 0, 0, 1, 0, 1]))\n3\n\njulia> weight(BitMatrix([1 0 0 0 1 0 0 1 0 1; 1 1 1 1 1 0 0 0 0 0]))\n8\n\n\n\n\n\nweight(pauli::Union{AbstractString,AbstractVector{<:AbstractString}}) -> Int\n\nReturn the weight of the Pauli string operator(s).\n\nExamples\n\njulia> weight(\"XIZIY\")\n3\n\njulia> weight([\"XIZIY\", \"XXXXX\"])\n8\n\n\n\n\n\n","category":"function"},{"location":"api/#Index","page":"Index","title":"Index","text":"","category":"section"},{"location":"api/","page":"Index","title":"Index","text":"","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"CurrentModule = Qecsim","category":"page"},{"location":"#Qecsim.jl-Quantum-Error-Correction-Simulator","page":"Overview","title":"Qecsim.jl - Quantum Error Correction Simulator","text":"","category":"section"},{"location":"#Introduction","page":"Overview","title":"Introduction","text":"","category":"section"},{"location":"","page":"Overview","title":"Overview","text":"Qecsim.jl is a Julia package for simulating quantum error correction using stabilizer codes.","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"NOTE: Qecsim.jl is a ground-up rewrite of the Python package qecsim.","category":"page"},{"location":"#Installation","page":"Overview","title":"Installation","text":"","category":"section"},{"location":"","page":"Overview","title":"Overview","text":"Qecsim.jl is installed, like any other registered Julia package, using the Julia package manager Pkg:","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"pkg> add Qecsim  # Press ']' to enter the Pkg REPL mode.","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"or","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"julia> using Pkg; Pkg.add(\"Qecsim\")","category":"page"},{"location":"#Examples","page":"Overview","title":"Examples","text":"","category":"section"},{"location":"#Simulation-run","page":"Overview","title":"Simulation run","text":"","category":"section"},{"location":"","page":"Overview","title":"Overview","text":"using Qecsim, Qecsim.BasicModels, Qecsim.GenericModels\ndata = qec_run(FiveQubitCode(), BitFlipErrorModel(), NaiveDecoder(), 0.1; max_runs=100);\ndata","category":"page"},{"location":"#Simulation-plot","page":"Overview","title":"Simulation plot","text":"","category":"section"},{"location":"","page":"Overview","title":"Overview","text":"NOTE: This example assumes that Plots is installed.","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"using Qecsim, Qecsim.BasicModels, Qecsim.GenericModels, Logging, Plots\nwith_logger(NullLogger()) do\n    error_probabilities = 0.0:0.02:0.5\n    codes = [FiveQubitCode(), SteaneCode()]\n    error_model = DepolarizingErrorModel()\n    decoder = NaiveDecoder()\n    max_runs = 5000\n    failure_rates = [[] for _ in codes]\n    for p in error_probabilities, (code, f) in zip(codes, failure_rates)\n        data = qec_run(code, error_model, decoder, p; max_runs=max_runs)\n        push!(f, data[:logical_failure_rate])\n    end\n    labels = reshape([label(c) for c in codes], 1, :)\n    plot(\n        error_probabilities, failure_rates; label=labels, legend=:right,\n        xlabel=\"Error probability\", ylabel=\"Logical failure rate\"\n    )\nend;\nsavefig(\"examples-plot.png\"); # hide","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"(Image: examples plot)","category":"page"},{"location":"#Citing","page":"Overview","title":"Citing","text":"","category":"section"},{"location":"","page":"Overview","title":"Overview","text":"Please cite Qecsim.jl if you use it in your research. It was first introduced in the following thesis:","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"D. K. Tuckett, Tailoring surface codes: Improvements in quantum error correction with biased noise, Ph.D. thesis, University of Sydney (2020), (qecsim: https://github.com/qecsim/Qecsim.jl).","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"A suitable BibTeX entry is:","category":"page"},{"location":"","page":"Overview","title":"Overview","text":"@phdthesis{qecsim,\n    author = {Tuckett, David Kingsley},\n    title = {Tailoring surface codes: Improvements in quantum error correction with biased noise},\n    school = {University of Sydney},\n    doi = {10.25910/x8xw-9077},\n    year = {2020},\n    note = {(qecsim: \\url{https://github.com/qecsim/Qecsim.jl})}\n}","category":"page"},{"location":"#License","page":"Overview","title":"License","text":"","category":"section"},{"location":"","page":"Overview","title":"Overview","text":"Qecsim.jl is released under the BSD 3-Clause license, see LICENSE.","category":"page"},{"location":"#Links","page":"Overview","title":"Links","text":"","category":"section"},{"location":"","page":"Overview","title":"Overview","text":"Source code: https://github.com/qecsim/Qecsim.jl\nDocumentation: https://qecsim.github.io/Qecsim.jl\nContact: qecsim@gmail.com","category":"page"},{"location":"api/models/#Models","page":"Models","title":"Models","text":"","category":"section"},{"location":"api/models/#BasicModels","page":"Models","title":"BasicModels","text":"","category":"section"},{"location":"api/models/","page":"Models","title":"Models","text":"CurrentModule = Qecsim.BasicModels","category":"page"},{"location":"api/models/","page":"Models","title":"Models","text":"BasicModels\nBasicModels.BasicCode\nBasicModels.FiveQubitCode\nBasicModels.SteaneCode","category":"page"},{"location":"api/models/#Qecsim.BasicModels","page":"Models","title":"Qecsim.BasicModels","text":"Basic stabilizer codes\n\n\n\n\n\n","category":"module"},{"location":"api/models/#Qecsim.BasicModels.BasicCode","page":"Models","title":"Qecsim.BasicModels.BasicCode","text":"BasicCode <: StabilizerCode\n\nBasicCode(\n    pauli_stabilizers::AbstractVector{<:AbstractString},\n    pauli_logical_xs::AbstractVector{<:AbstractString},\n    pauli_logical_zs::AbstractVector{<:AbstractString},\n    nkd::Tuple{Integer,Integer,Union{Integer,Missing}}=nothing,\n    label::AbstractString=nothing\n)\n\nConstruct a basic code from string representations of stabilizers and logical operators.\n\nPaulis are expressed as strings of capitalized I, X, Y, Z characters, with one character per physical qubit. Logical X and Z operators are in matching order, with one of each for each logical qubit. Optional nkd defaults to n and k evaluated and d missing. Optional label defaults to \"Basic [n,k,d]\".\n\nExamples\n\njulia> using Qecsim.BasicModels\n\njulia> code = BasicCode([\"ZZI\", \"IZZ\"], [\"XXX\"], [\"IIZ\"])  # 3-qubit repetition\nBasicCode([\"ZZI\", \"IZZ\"], [\"XXX\"], [\"IIZ\"], (3, 1, missing), \"Basic [3,1,missing]\")\n\njulia> validate(code)  # no error indicates operators satisfy commutation relations\n\njulia> nkd(code)  # default nkd\n(3, 1, missing)\n\njulia> label(code)  # default label\n\"Basic [3,1,missing]\"\n\n\n\n\n\n","category":"type"},{"location":"api/models/#Qecsim.BasicModels.FiveQubitCode","page":"Models","title":"Qecsim.BasicModels.FiveQubitCode","text":"FiveQubitCode() -> BasicCode\n\nConstruct 5-qubit [5,1,3] code as a BasicCode.\n\n\n\n\n\n","category":"function"},{"location":"api/models/#Qecsim.BasicModels.SteaneCode","page":"Models","title":"Qecsim.BasicModels.SteaneCode","text":"SteaneCode() -> BasicCode\n\nConstruct Steane [7,1,3] code as a BasicCode.\n\n\n\n\n\n","category":"function"},{"location":"api/models/#GenericModels","page":"Models","title":"GenericModels","text":"","category":"section"},{"location":"api/models/","page":"Models","title":"Models","text":"CurrentModule = Qecsim.GenericModels","category":"page"},{"location":"api/models/","page":"Models","title":"Models","text":"GenericModels\nGenericModels.SimpleErrorModel\nModel.generate(::SimpleErrorModel, ::StabilizerCode, ::Float64, ::AbstractRNG)\nGenericModels.BitFlipErrorModel\nGenericModels.BitPhaseFlipErrorModel\nGenericModels.DepolarizingErrorModel\nGenericModels.PhaseFlipErrorModel\nGenericModels.NaiveDecoder","category":"page"},{"location":"api/models/#Qecsim.GenericModels","page":"Models","title":"Qecsim.GenericModels","text":"Generic error models and decoders compatible with any stabilizer codes.\n\n\n\n\n\n","category":"module"},{"location":"api/models/#Qecsim.GenericModels.SimpleErrorModel","page":"Models","title":"Qecsim.GenericModels.SimpleErrorModel","text":"SimpleErrorModel <: ErrorModel\n\nAbstract supertype for simple IID error models that generate errors based on the number of qubits and a probability distribution.\n\n\n\n\n\n","category":"type"},{"location":"api/models/#Qecsim.Model.generate-Tuple{Qecsim.GenericModels.SimpleErrorModel, StabilizerCode, Float64, Random.AbstractRNG}","page":"Models","title":"Qecsim.Model.generate","text":"generate(\n    error_model::SimpleErrorModel, code, p::Real, [rng::AbstractRNG=GLOBAL_RNG]\n) -> BitVector\n\nGenerate a new IID error based on Model.probability_distribution. See also Model.generate.\n\nnote: Note\nThe method Model.probability_distribution should be implemented for concrete subtypes of SimpleErrorModel.\n\n\n\n\n\n","category":"method"},{"location":"api/models/#Qecsim.GenericModels.BitFlipErrorModel","page":"Models","title":"Qecsim.GenericModels.BitFlipErrorModel","text":"BitFlipErrorModel <: SimpleErrorModel\n\nIID error model with probability vector: (p_I p_X p_Y p_Z) = (1-p p 0 0), where p is the probability of an error on a single-qubit.\n\n\n\n\n\n","category":"type"},{"location":"api/models/#Qecsim.GenericModels.BitPhaseFlipErrorModel","page":"Models","title":"Qecsim.GenericModels.BitPhaseFlipErrorModel","text":"BitPhaseFlipErrorModel <: SimpleErrorModel\n\nIID error model with probability vector: (p_I p_X p_Y p_Z) = (1-p 0 p 0), where p is the probability of an error on a single-qubit.\n\n\n\n\n\n","category":"type"},{"location":"api/models/#Qecsim.GenericModels.DepolarizingErrorModel","page":"Models","title":"Qecsim.GenericModels.DepolarizingErrorModel","text":"DepolarizingErrorModel <: SimpleErrorModel\n\nIID error model with probability vector: (p_I p_X p_Y p_Z) = (1-p p3 p3 p3), where p is the probability of an error on a single-qubit.\n\n\n\n\n\n","category":"type"},{"location":"api/models/#Qecsim.GenericModels.PhaseFlipErrorModel","page":"Models","title":"Qecsim.GenericModels.PhaseFlipErrorModel","text":"PhaseFlipErrorModel <: SimpleErrorModel\n\nIID error model with probability vector: (p_I p_X p_Y p_Z) = (1-p 0 0 p), where p is the probability of an error on a single-qubit.\n\n\n\n\n\n","category":"type"},{"location":"api/models/#Qecsim.GenericModels.NaiveDecoder","page":"Models","title":"Qecsim.GenericModels.NaiveDecoder","text":"NaiveDecoder <: Decoder\n\nNaiveDecoder([max_qubits=10])\n\nConstruct a naive decoder that iterates through all possible errors, in ascending weight, and resolves to the first error that matches the syndrome.\n\nnote: Note\nThis decoder is slow for even moderate numbers of qubits. By default, it is restricted to codes with a maximum of 10 qubits.\n\n\n\n\n\n","category":"type"}]
}
