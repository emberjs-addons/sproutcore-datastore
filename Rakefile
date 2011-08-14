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

# Set up the intermediate and output directories for the interim build process

SproutCore::Compiler.intermediate = "tmp/sproutcore-datastore"
SproutCore::Compiler.output       = "tmp/static"

# Create a compile task for a SproutCore package. This task will compute
# dependencies and output a single JS file for a package.
def compile_task
  js_tasks = SproutCore::Compiler::Preprocessors::JavaScriptTask.with_input "lib/**/*.js", '.'
  SproutCore::Compiler::CombineTask.with_tasks js_tasks, "#{SproutCore::Compiler.intermediate}"
end

task :build => compile_task

file "dist/sproutcore-datastore.js" => :build do
  puts "Generating sproutcore-datastore.js"

  mkdir_p "dist"

  File.open("dist/sproutcore-datastore.js", "w") do |file|
    # TODO: make it generate to tmp/static/sproutcore-datastore.js
    file.puts strip_require("tmp/static/tmp/sproutcore-datastore.js")
  end
end

task :default => :"dist/sproutcore-datastore.js"
