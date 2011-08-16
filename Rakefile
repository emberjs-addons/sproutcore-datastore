require 'bundler/setup'
require "erb"
require "uglifier"
require "sproutcore"

module SproutCore
  module Compiler
    class Entry
      def body
        "\n(function(exports) {\n#{@raw_body}\n})({});\n"
      end
    end
  end
end

def strip_require(file)
  result = File.read(file)
  result.gsub!(%r{^\s*require\(['"]([^'"])*['"]\);?\s*$}, "")
  result
end

def strip_sc_assert(file)
  result = File.read(file)
  result.gsub!(%r{^(\s)+sc_assert\((.*)\).*$}, "")
  result
end

def uglify(file)
  uglified = Uglifier.compile(File.read(file))
  "#{LICENSE}\n#{uglified}"
end

SproutCore::Compiler.output       = "tmp/static"

def compile_datastore_task
  SproutCore::Compiler.intermediate = "tmp/sproutcore-datastore"
  js_tasks = SproutCore::Compiler::Preprocessors::JavaScriptTask.with_input "lib/**/*.js", '.'
  SproutCore::Compiler::CombineTask.with_tasks js_tasks, "#{SproutCore::Compiler.intermediate}"
end

def compile_indexset_task
  SproutCore::Compiler.intermediate = "tmp/intermidiate"
  js_tasks = SproutCore::Compiler::Preprocessors::JavaScriptTask.with_input "packages/sproutcore-indexset/lib/**/*.js", '.'
  SproutCore::Compiler::CombineTask.with_tasks js_tasks, "#{SproutCore::Compiler.intermediate}/sproutcore-indexset"
end

task :compile_indexset_task  => compile_indexset_task
task :compile_datastore_task => compile_datastore_task

task :build => [:compile_indexset_task, :compile_datastore_task]

file "dist/sproutcore-datastore.js" => :build do
  puts "Generating sproutcore-datastore.js"

  mkdir_p "dist"

  File.open("dist/sproutcore-datastore.js", "w") do |file|
    # TODO: make it generate to tmp/static/sproutcore-datastore.js
    file.puts strip_require("tmp/static/sproutcore-indexset.js")
    file.puts strip_require("tmp/static/tmp/sproutcore-datastore.js")
  end
end

task :default => :"dist/sproutcore-datastore.js"
