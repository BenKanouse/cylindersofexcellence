require 'spec_helper'

describe Repo do

  let(:file_to_blame) { "spec/support/file_to_blame.rb" }
  let(:first_stat) { repo.stats.find { |stat| stat.file_name == file_to_blame } }
  let(:repo) { Repo.new('railsrumble/r14-team-290') }

  specify { expect(repo.name).to eq("r14-team-290") }
  specify { expect(repo.url).to eq("https://github.com/railsrumble/r14-team-290.git") }
  specify { expect(repo.owner_and_name).to eq("railsrumble/r14-team-290") }

  it 'clones the repo' do
    repo.stats
    expect(Dir.exists?("tmp/r14-team-290")).to be(true)
  end

  describe "#stats" do
    subject { first_stat }
    specify { expect(subject.person).to eq("kanobt61@gmail.com") }
    specify { expect(subject.lines_for_person).to eq(36) }
    specify { expect(subject.total_lines).to eq(41) }
  end

  describe "to_json" do
    subject { JSON.parse(first_stat.to_json) }
    specify { expect(subject["file_name"]).to eq(file_to_blame) }
    specify { expect(subject["lines_for_person"]).to eq(36) }
    specify { expect(subject["person"]).to eq("kanobt61@gmail.com") }
    specify { expect(subject["total_lines"]).to eq(41) }
  end
end
